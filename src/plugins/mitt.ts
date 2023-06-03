import mitt from 'mitt';

interface ICloseProps {
    params?: any
    id: string
}

type Events = {
    layerClose: ICloseProps
};

const emitter = mitt<Events>();

export default emitter;
