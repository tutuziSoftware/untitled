(function(){
    "use strict";

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

