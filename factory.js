////quizMetrics Factory
myApp.factory('quizMetrics',['dataService',function(dataService)

{

	var quizObj = {
		quizActive : false,
		resultsActive: false,
		changeState : changeState,
		correctAnswers : [],
		 markQuiz: markQuiz, 
   		 numCorrect: 0

	};



	function changeState(metric, state){
		if(metric === "quiz"){
			quizObj.quizActive = state;
		}else if(metric === "results"){
			quizObj.resultsActive = state;
		}else{
			return false;
		}
	} 

	function markQuiz(){
	
		 quizObj.correctAnswers = dataService.correctAnswers;
		 for(var i = 0; i < dataService.questionList.length; i++){
        if(dataService.questionList[i].selected === dataService.correctAnswers[i]){
            dataService.questionList[i].correct = true;
            quizObj.numCorrect++;
        }else{
            dataService.questionList[i].correct = false;
        }
    }
	} 


	return quizObj;

}])

//dataService Factory
myApp.factory('dataService',['$http',function($http)

{

	var dataObj = {

	};

	dataObj.correctAnswers = [1, 2, 3, 0, 2, 0, 3, 2, 0, 3];
	dataObj.getTurtleData = function(){ 
		return $http.get('data1.json');
	}

	dataObj.getQuestion = function(){ 
		return $http.get('questions.json');
	}

	return dataObj;
}])



// myApp.service('quizMetrics',function()
// {

// 		 var self = this;
// 		this.quizActive = false;

// 		this.changeStatus = function(state) {

//         self.quizActive = state;

//     }
// })

