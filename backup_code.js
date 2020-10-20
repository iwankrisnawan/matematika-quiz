// untuk membersihkan session dan coockie
// localStorage.clear();
// sessionStorage.clear();



// sessionStorage.setItem("history", JSON.stringify([]));
// console.log(JSON.parse(sessionStorage.getItem("history")));
var cek = $('.maman').css("display");
console.log(cek);

function check_session(){
  if(sessionStorage.getItem("my_points")) {
    $('#point').html(sessionStorage.getItem("my_points"));
  }else{
    sessionStorage.setItem("my_points", 0);
    sessionStorage.setItem("history", JSON.stringify([]));
  }
}

check_session();

class Math_class {
  constructor() {
    this.quiz = '';
    this.my_answer = '';
    this.inputValue = '';
    this.point = '';

    this.request = [];
    this.history = [];

    this.request['math_op'] = [' + ',' - ',' x '];
    this.request['number'] = [];
    this.request['timer'] = false;

    this.totalSeconds = 0;
    this.intervalActive = null;

    this.audio = new Audio('sound/ding_sound.mp3');
  }

  question(){
    let min = Math.ceil($('#start_number').val());
    let max = Math.floor($('#end_number').val());

    let soal1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let soal2 = Math.floor(Math.random() * (max - min + 1)) + min;

    let math_op = this.request['math_op'][Math.floor(Math.random()*this.request['math_op'].length)];
    if (soal1 > soal2) {
      this.quiz = soal1 + math_op + soal2;
    }else {
      this.quiz = soal2 + math_op + soal1;
    }

    if(this.request['timer'] === true){
      this.totalSeconds = 0;
      this.intervalActive = setInterval(this.setTime.bind(this), 10); // must use bind, cause if no use, "this" cannot call in function setTime
    }else{
      this.totalSeconds = 0;
      clearInterval(this.intervalActive);
    }
    // this.intervalActive;

    $('#questions').val(this.quiz);
  }

  check_answer(){
    if (this.inputValue == eval(this.quiz.replace("x", "*"))) {
      this.audio.currentTime = 0;
      this.audio.play();
      let timer = "00:00";

      // update session
      let historySession = JSON.parse(sessionStorage.getItem("history")); // get data session history

      if(historySession.length >= 5){
        historySession.shift(); // remove first item data array history session
      }

      historySession.push([this.inputValue, timer]); // push session history
      window.sessionStorage.setItem("history", JSON.stringify(historySession));


      this.point = sessionStorage.getItem("my_points");
      sessionStorage.setItem("my_points", parseInt(this.point) + 1);

      $("#point").html(parseInt(sessionStorage.getItem("my_points")));

      this.question();
      this.inputValue = '';

      setTimeout(function(){
        $("#my_answer").val('');
      },100);

    }
  }

  setTime(){
    ++this.totalSeconds;

    let pad = (value) => {
      let valString = value + " ";
      if(valString.length < 2){
        return "0" + valString;
      }
      else{
        return valString;
      }
    }

    $('#seconds').html(pad => this.totalSeconds % 60);
    $('#minutes').html(pad => parseInt(this.totalSeconds / 60));
  }

}
// end class Math_class

let math = new Math_class;

$('#reset_point').click(function(){
  let alert_confirm = confirm("You will lose your point you have");
  if (alert_confirm == true) {
    sessionStorage.setItem("my_points", 0);
    sessionStorage.setItem("history", '');
    $('#point').html(sessionStorage.getItem("my_points"));
  }
});

$('#history_quest').click(function(){
  console.log(JSON.parse(sessionStorage.getItem("history")));
  // for (i = 0; i < JSON.parse(sessionStorage.getItem("history")).length; i++) {
  //   console.log(JSON.parse(sessionStorage.getItem("history"))[i]);
  // }
});

$('.math_operations').on('click',function(){
  let data_mathOp = $(this).data('op');
  let check_class = $(this).hasClass('btn btn-primary');
  if (check_class) {
    $(this).removeClass("btn btn-primary");
    $(this).addClass("btn btn-danger");
    math.request['math_op'].splice(math.request['math_op'].indexOf(data_mathOp), 1)
  }else {
    $(this).removeClass("btn btn-danger");
    $(this).addClass("btn btn-primary");
    math.request['math_op'].push(data_mathOp)
  }
});

$('#timerRequest').on('change',function(){
  if (this.checked) {
      math.request['timer'] = true;
    }else {
      math.request['timer'] = false;
      console.log(math.request['timer']);
    }
});

$('#submit_request').on('click',function(){
  if (parseInt($('#start_number').val()) < parseInt($('#end_number').val())) {
    math.question();
    $('#requestFrom').modal('toggle');
  }else {
    alert('masukkan input dengan benar');
  }
});

$('.button_number').on('click', function(){
  let value = $(this).attr('data-value');
  $("#my_answer").val(math.inputValue += value);
  math.inputValue = $('#my_answer').val();
  math.check_answer();
});

$('#button_delete').on('click',function(){
  let value = $(this).attr('data-value');
  let input_jawaban = $('#my_answer').val();
  if (input_jawaban.length === 1) {
    $("#my_answer").val('');
    math.inputValue = '';
  }else{
    $("#my_answer").val(input_jawaban.substr(0, math.inputValue.length - 1));
    math.inputValue = $("#my_answer").val();
  }
  math.check_answer();
});

$('#change_button').on('click',function(){  
  math.question();
});

