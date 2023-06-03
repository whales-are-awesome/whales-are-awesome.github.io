type ClassesUtilities = Record<string, string>;
type ClassesProps = Record<string, any>;
export type StaticDefinition = string | Array<string | Record<string, boolean>> | Record<string, boolean>;
export type StaticClassesMap = Record<string, StaticDefinition>;
type DynamicDefinition<T> = (props: T)=> StaticDefinition;
type ClassDefinition<T> = StaticDefinition | DynamicDefinition<T>;
type ClassesCollection<T> = Record<string, ClassDefinition<T>>;


type ThemeCallback<T> = (globalUtilities: ClassesUtilities, localUtilities?: ClassesUtilities)=> ClassesCollection<T>;
type UseClassesCallback<T> = (props?: T)=> StaticClassesMap;


const globalUtilities: ClassesUtilities = {};


const makeClasses = function<ThemeProps = ClassesProps>(themeBuilder: ThemeCallback<ThemeProps>, localUtilities?: ClassesUtilities): UseClassesCallback<ThemeProps> {
    const allClassesEntries = Object.entries(themeBuilder(globalUtilities, localUtilities)).map(
        (item): [string, ClassDefinition<ThemeProps>, {isReactive: boolean}] => {
            return [
                ...item,
                {
                    isReactive: typeof item[1] === 'function'
                }
            ];
        }
    );
    const reactiveClasses = allClassesEntries.filter(item => item[2].isReactive);
    const staticClasses = allClassesEntries.filter(item => !item[2].isReactive);

    const staticClassesResult = staticClasses.reduce(
        (result: Record<string, StaticDefinition>, _item) => {
            const [name, classes] = _item as [string, StaticDefinition, unknown];
            let item: StaticDefinition = [];

            if (Array.isArray(classes)) {
                item = item.concat(classes);
            } else {
                item.push(classes);
            }

            result[name] = item;

            return result;
        },
        {}
    );

    const useClasses = (props?: ThemeProps): StaticClassesMap => {
        let reactiveClassesResult = null;

        if (reactiveClasses.length && !props) {
            throw new Error('Используются динамические классы, но не переданы пропы в useClasses');
        } else if (reactiveClasses.length && props) {
            reactiveClassesResult = reactiveClasses.reduce(
                (result: Record<string, StaticDefinition>, _item) => {
                    const [name, builder] = _item as [string, DynamicDefinition<typeof props>, unknown];

                    //@ts-ignore
                    result[name] = builder(props);

                    return result;
                },
                {}
            );

            return Object.assign(reactiveClassesResult, staticClassesResult);
        }

        return staticClassesResult;
    };

    return useClasses;
};


export default makeClasses;
