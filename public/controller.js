angular
    .module('app')
    .controller('controller', controller);

controller.$inject = ['$scope', '$timeout', '$rootScope'];

function controller($scope, $timeout, $rootScope) {
    var vm = this;

    // experiences
    vm.experiences = [];
    vm.newExperience = null;

    vm.searchSkillsText = null;
    vm.searchSkillsResults = [];

    vm.experiencesFilters = [];

    vm.searchSkills = (query) => {
        if(!query || query.length === 0) return vm.skills;
        return vm.skills.filter((skill) => { return skill.indexOf(query) !== -1 });
    }

    vm.addExperience = () => {
        if(vm.newExperience) {
            vm.experiences.push({
                text: vm.newExperience,
                skills: []
            });
        }
        vm.newExperience = null;
    }

    vm.removeExperience = (experience) => {
        var index = vm.experiences.indexOf(experience);
        vm.experiences.splice(index, 1);
    }

    vm.applyExperiencesFilters = (experiences) => {
        if(vm.experiencesFilters.length === 0) return experiences;

        return experiences.filter((experience) => {
            var shouldInclude = false;

            vm.experiencesFilters.forEach((filter) => {
                if(experience.skills.indexOf(filter) !== -1) {
                    shouldInclude = true;
                }
            });

            return shouldInclude;
        });
    }

    // skills
    vm.skills = [];
 
    vm.removeSkill = (skill) => {
        vm.experiences.forEach((experience) => {
            var index = experience.skills.indexOf(skill); 
            if(index !== -1) {
                experience.skills.splice(index, 1);
            }
        });
    }


    // firebase setup
    var database = firebase.database();
    var delayInMs = 2000;

    var experiencesTimeoutPromise;
    var experiencesLoaded = false;
    var experiencesJustLoaded = false;
    $scope.$watch('vm.experiences', (experiences) => {
         if(experiencesJustLoaded) {
            experiencesJustLoaded = !experiencesJustLoaded;
        }else if(experiencesLoaded) {
            $timeout.cancel(experiencesTimeoutPromise);
            experiencesTimeoutPromise = $timeout(function(){
                database.ref('experiences').set(angular.copy(experiences));
            }, delayInMs);
        }
    }, true);

    var skillsTimeoutPromise;
    var skillsLoaded = false;
    var skillsJustLoaded = false;
    $scope.$watch('vm.skills', (skills) => {
        if(skillsJustLoaded) {
            skillsJustLoaded = !skillsJustLoaded;
        }else if(skillsLoaded){
            $timeout.cancel(skillsTimeoutPromise);
            skillsTimeoutPromise = $timeout(function(){
                database.ref('skills').set(angular.copy(skills));
            }, delayInMs);
        }
    }, true);

    database.ref().once('value').then(function(snapshot) {
        var data = snapshot.val();

        vm.experiences.push.apply(vm.experiences, data.experiences);
        vm.experiences.forEach((experience) => {
            if(!experience.skills) {
                experience.skills = [];
            }
        });
        experiencesLoaded = experiencesJustLoaded = true;

        vm.skills.push.apply(vm.skills, data.skills);
        skillsLoaded = skillsJustLoaded = true;

        $scope.$apply();
    });

}