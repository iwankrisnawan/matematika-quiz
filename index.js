// untuk membersihkan session dan coockie
// localStorage.clear();
// sessionStorage.clear();

class Math_class {
  constructor() {
    this.quiz = '';
    this.my_answer = '';
    this.inputValue = '';
    this.directInput = 'right';

    this.request = [];

    this.request['math_op'] = [' + ',' - ',' x '];
    this.request['number'] = [];

    this.audio = new Audio('sound/ding_sound.mp3');
  }

  question(){
    let min = Math.ceil($('#start_number').val());
    let max = Math.floor($('#end_number').val());

    let soal1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let soal2 = Math.floor(Math.random() * (max - min + 1)) + min;

    let math_op = this.request['math_op'][Math.floor(Math.random()*this.request['math_op'].length)];

    this.quiz = (soal1 > soal2) ? soal1 + math_op + soal2 : soal2 + math_op + soal1;

    $('#questions').val(this.quiz);
  }

  check_answer(){
    if (this.inputValue == eval(this.quiz.replace("x", "*"))) {
      this.audio.currentTime = 0;
      this.audio.play();
      let timer = "00:00";

      this.question();
      this.inputValue = '';

      setTimeout(function(){
        $("#my_answer").val('');
      },100);

    }
  }

}
// end class Math_class

let math = new Math_class;

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

$('#submit_request').on('click',function(){
  if (parseInt($('#start_number').val()) < parseInt($('#end_number').val())) {
    math.question();
    $('#requestFrom').modal('toggle');
  }else {
    alert('please input the number correctly');
    $('#start_number').val('');
    $('#end_number').val('');
  }
});

$('.button_number').on('click', function(){
  let value = $(this).attr('data-value');

  $('#my_answer').val((math.directInput == 'right') ? math.inputValue += value : value += math.inputValue)

  math.inputValue = $('#my_answer').val();
  math.check_answer();
});

$('#button_delete').on('click',function(){
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

$('#direct-input-btn').on('click', function(){
  let data = $(this).data('value');

  data = (data == 'right' ) ? 'left' : 'right';
  
  math.directInput = data;
  $(this).html(data);
  $(this).data('value',data);
});

