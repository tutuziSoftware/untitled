var Task;

(function(){
    "use strict";

    Task = class {
        constructor(settings) {
            if(settings === void 0){
                settings = {
                    task_name:"",
                    work_time:0,
                    id:Date.now(),
                    updated:Date.now(),
                    check:false,
                    date:""
                };
            }

            this.task_name = settings.task_name ? settings.task_name : "";
            //TODO 数値チェックを入れる
            this.work_time = settings.work_time ? settings.work_time : 0;
            this._id = settings.id ? settings.id : "";
            this.updated = settings.updated ? new Date(settings.updated).getTime() : "";
            this._check = typeof settings.check === "boolean" ? settings.check : false;
            this.date = settings.date;
        }

        get id(){
            return this._id;
        }

        set check(check){
            if(typeof check !== "boolean") return;

            this._check = check;
        }

        get check(){
            return this._check;
        }

        save(){
            localStorage["task_"+this.id] = JSON.stringify({
                id:this.id,
                task_name:this.task_name,
                work_time:this.work_time,
                updated:Date.now(),
                check:this.check,
                date:this.date
            });

            //TODO サーバに保存
        }

        delete(){
            delete localStorage["task_".this._id];

            //TODO サーバに保存
        }
    }
})();