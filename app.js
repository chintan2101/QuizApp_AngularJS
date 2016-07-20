
var myApp = angular.module('myApp', []);


myApp.controller('mainController',['$scope','$http','quizMetrics','dataService',function($scope,$http,quizMetrics,dataService) {
	

	dataService.getTurtleData().success(function(response){
		$scope.turtlelist = response;
	});

	$scope.quizMetrics = quizMetrics;
	$scope.dataService = dataService;
	$scope.activeTurtle = [];
	//$scope.quizActive =false;
	// $http.get('data1.json')
	// .success(function(resp)
	// {
	// 	$scope.turtlelist = resp;

	// });

	$scope.changeActiveTurtle=function(index)
	{
		$scope.activeTurtle =index;
	} 
	$scope.activateQuiz=function(index)
	{
		//$scope.quizActive =true;
		//$scope.quizMetrics.quizActive =true;
		quizMetrics.changeState("quiz",true);
	}
	//console.log($scope.turtlelist);
}])

myApp.controller('quizCtrl',['$scope','$http','quizMetrics','dataService',function($scope,$http,quizMetrics,dataService) {
	
	$scope.quizMetrics = quizMetrics;
	$scope.dataService = dataService;
	$scope.activeQuestion = 0;
	$scope.error = false;
	$scope.finalise = false;
	var numQuestionsAnswered = 0;

	dataService.getQuestion().success(function(response){
		$scope.questionList = response;
		dataService.questionList =response;
	});


	$scope.questionAnswered=function()
	{
		var quizLength = $scope.questionList.length;

      
		if($scope.questionList[$scope.activeQuestion].selected !== null){
			numQuestionsAnswered++;
			if(numQuestionsAnswered >= quizLength){
				for(var i = 0; i < quizLength; i++){

					if($scope.questionList[i].selected === null){
						$scope.setActiveQuestion(i);
						return;
					}
				}

				$scope.error = false;
				$scope.finalise = true;
				return;

			}
		}
	//	console.log(numQuestionsAnswered);
		$scope.setActiveQuestion();

	} 


	$scope.setActiveQuestion=function(index)
	{


		if(index === undefined)
		{
			var breakOut = false;
			var quizLength = $scope.questionList.length-1;

			while(!breakOut)
			{
				if($scope.activeQuestion < quizLength){
					$scope.activeQuestion++;
				}
				else{
					$scope.activeQuestion = 0;
				}

				if( $scope.activeQuestion === 0)
				{
					$scope.error = true;
				}


				if($scope.questionList[$scope.activeQuestion].selected === null){
					breakOut = true;
				}
			}
		}
		else
		{
			$scope.activeQuestion = index;
		}

	} 
	$scope.selectAnswer=function(index)
	{
		
		$scope.questionList[$scope.activeQuestion].selected = index;
	} 
	$scope.finaliseAnswers=function()
	{
	//	console.log("hello");
		$scope.finalise = false;
		numQuestionsAnswered = 0;
		$scope.activeQuestion = 0;
		quizMetrics.markQuiz();
		quizMetrics.changeState("quiz", false);
		quizMetrics.changeState("results", true);
	} 

}])


myApp.controller('resultsCtrl',['$scope','$http','quizMetrics','dataService',function($scope,$http,quizMetrics,dataService) {
	
	$scope.quizMetrics = quizMetrics;
	$scope.dataService = dataService;
	$scope.activeQuestion = 0;
	$scope.quizLength = 0;
	$scope.getAnswerClass=function(index)
	{
		if(index === quizMetrics.correctAnswers[$scope.activeQuestion]){
			return "bg-success";
		}else if(index === dataService.questionList[$scope.activeQuestion].selected){
			return "bg-danger";
		}
		 $scope.quizLength = dataService.questionList.length;
	} 
	


	$scope.setActiveQuestion=function(index)
	{
		$scope.activeQuestion =index;

	} 

	$scope.calculatePerc=function()
	{

		//console.log( $scope.quizLength);
		return quizMetrics.numCorrect/ $scope.quizLength * 100;
	} 

	$scope.reset=function()
	{

	quizMetrics.changeState("results", false);
    quizMetrics.numCorrect = 0;

    for(var i = 0; i < dataService.questionList.length; i++){
        var data = dataService.questionList[i]; //binding the current question to data to keep code clean

        data.selected = null;
        data.correct = null;
    }
		
	} 

}])