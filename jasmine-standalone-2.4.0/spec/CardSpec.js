describe("Tasks", ()=>{
    describe("", ()=>{
        var tasks = new Tasks;
        tasks.push({
            work_time:30
        });
        tasks.push({
            work_time:60
        });

        it("get_out_of_task_index", ()=>{
            expect(tasks.get_out_of_task_index(29)).toBe(0);
            expect(tasks.get_out_of_task_index(30)).toBe(1);
            expect(tasks.get_out_of_task_index(89)).toBe(1);
            expect(tasks.get_out_of_task_index(90)).toBe(2);
        });
    });
});
