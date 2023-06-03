const scrollAt = {
    /**
     * @example: <div v-scroll-at.bottom="loadMore"></div>
     */

    beforeMount(el: any, binding: any) {
        binding.dir.scrollHandler = scrollHandler;

        let loading = false
        const done = () => { loading = false }

        function scrollHandler() {
            const elOffsetTop = el.scrollTop;

            const trigger = el.scrollHeight < elOffsetTop + el.clientHeight + 10;

            if (binding.value && !loading && trigger) {
                loading = true;

                const result = binding.value();

                if (result === undefined) done();
                else if (result.then && result.then.call) result.then(done, done);
                else done();
            }
        }

        el.addEventListener('scroll', binding.dir.scrollHandler);
        scrollHandler();
    },
    unmounted(el: any, binding: any) {
        window.removeEventListener('scroll', binding.dir.scrollHandler);
    }
}
export default scrollAt;
