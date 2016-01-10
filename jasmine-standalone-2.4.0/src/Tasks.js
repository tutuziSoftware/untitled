var Tasks;

(function(){
    "use strict";

    Tasks = class extends Array {
        doInitialized($http){
            return new Promise((resolv)=>{
                //localStorageからデータ取得
                var task_id_list = JSON.parse(localStorage["task_list"]);

                task_id_list.forEach((task_id)=>{
                    var task = new Task(JSON.parse(localStorage["task_"+task_id]));
                    this.push(task);
                });

                //TODO 通信してデータ取得
                setTimeout(()=>{
                    resolv(this);
                }, 0);
            });
        }

        /**
         * 作業時間総数から出るタスクの添字番号を返します。
         * @param work_time
         */
        get_out_of_task_index(work_time){
            for(var i = 0 ; i != this.length ; i++){
                work_time -= this[i].work_time;

                if(work_time < 0){
                    return i;
                }
            }

            return i;
        }

        save(){
            var task_list = this.map((task)=>{
                return task.id;
            });

            localStorage["task_list"] = JSON.stringify(task_list);
        }
    }
})();