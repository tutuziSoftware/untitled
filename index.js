(function(){
    "use strict";

    class Task {
        constructor(settings) {
            this.task_name = settings.task_name ? settings.task_name : "";
            //TODO 数値チェックを入れる
            this.work_time = settings.work_time ? settings.work_time : 0;
            this._id = settings.id ? settings.id : "";
            this.updated = settings.updated ? new Date(settings.updated).getTime() : "";
            this._check = typeof settings.check === "boolean" ? settings.check : false;
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
                check:this.check
            });

            //TODO サーバに保存
        }

        delete(){
            delete localStorage["task_".this._id];

            //TODO サーバに保存
        }
    }

    class Tasks extends Array {
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

        save(){
            var task_list = this.map((task)=>{
                return task.id;
            });

            localStorage["task_list"] = JSON.stringify(task_list);
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

        /**
         * タスクを終了します
         */
        $scope.task_end = function(){
            this.task.save();
        };
    });



    //---DOM処理---
    app.directive('untSortable', function(){
        return function(scope, element, iAttrs){
            $(element).sortable({
                handle:".sortable_icon",
                update:function(){
                    scope.$apply(function(){
                        var tasks = new Tasks;

                        $(element).sortable("toArray").forEach((task_id)=>{
                            var task = angular.element($("#"+task_id)).scope().task;
                            tasks.push(task);
                        });

                        //TODO タスクの順番を保存できるようにする

                        scope.tasks = tasks;

                        scope.tasks.save();
                    });
                }
            })
        };
    });
})();

