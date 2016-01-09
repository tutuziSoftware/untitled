(function(){
    "use strict";

    class Task {
        constructor(settings) {
            this._task_name = settings.task_name ? settings.task_name : "";
            //TODO 数値チェックを入れる
            this._work_time = settings.work_time ? settings.work_time : 0;
            this._id = settings.id ? settings.id : "";
            this._updated = settings.updated ? new Date(settings.updated).getTime() : "";
            this._check = typeof settings.check === "boolean" ? this.check : false;
        }

        get task_name(){
            return this._task_name;
        }

        get work_time(){
            return this._work_time;
        }

        get check(){
            return this._check;
        }

        save(){
            localStorage[this._id] = JSON.stringify({
                id:this._id,
                task_name:this._task_name,
                work_time:this._work_time,
                updated:Date.now()
            });

            //TODO サーバに保存
        }

        delete(){
            delete localStorage[this._id];

            //TODO サーバに保存
        }
    }

    class Tasks extends Array {
        doInitialized($http){
            return new Promise((resolv)=>{
                //TODO テストデータだからそのうち置き換える
                this.push({
                    "id":"1",
                    "task_name":"タスクa",
                    "work_time":30/*sec*/,
                    "check":false
                });
                this.push({
                    "id":"2",
                    "task_name":"タスクb",
                    "work_time":30/*sec*/,
                    "check":false
                });
                this.push({
                    "id":"3",
                    "task_name":"タスクc",
                    "work_time":30/*sec*/,
                    "check":false
                });

                //TODO localStorageからデータ取得
                //TODO 通信してデータ取得
                setTimeout(()=>{
                    resolv(this);
                }, 0);
            });
        }
    }

    class WorkTime{
        doInitialized($http){
            return new Promise((resolv)=>{
                this._work_time = 120;

                //TODO localStorageからデータ取得
                //TODO 通信してデータ取得
                setTimeout(()=>{
                    resolv(this);
                }, 0);
            });
        }

        set work_time(work_time){
            if(typeof work_time !== "number"){
                console.log("work_time is not number");
                return;
            }

            this._work_time = work_time;
        }

        get work_time(){
            return this._work_time;
        }

        valueOf(){
            return this._work_time;
        }
    }

    var app = angular.module('unt', []);
    app.controller('tasks', ($scope, $http)=> {
        new Tasks().doInitialized($http).then((tasks)=>{
            $scope.tasks = tasks;
            $scope.$apply();
        }).catch(()=>{

        });

        new WorkTime().doInitialized($http).then((work_time)=>{
            $scope.work_time_full = work_time;
            $scope.$apply();
        }).catch(()=>{

        });

        /*
         * memo:
         *  angularは()=>{}な関数を使うとthisが変化しない
         */

        $scope.task_write = function(){
            this.task.is_write = true;
        };

        $scope.task_write_end = function(){
            this.task.is_write = false;

            var task = new Task(this.task);
            task.save();
        };

        $scope.sum_work_task = function(){
            if($scope.tasks === void 0) return 0;

            var sum = $scope.tasks.reduce((sum, task)=>{
                return sum + (+task.work_time);
            }, 0);

            return sum;
        };

        $scope.task_delete = function(){
            var task = new Task(this.task);

            this.tasks.splice(this.$index, 1);
            task.delete();
        };
    });
})();