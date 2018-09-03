
var amount = $('#amount');
amount.prop('disabled', true); // блокировка input, пока не выберем размер
$('.color-item>span').bind('click', function() {

    amount.val('');//обнуление input-а

    removeClass();

    var block = $(this);

    block.parent().addClass('active');

    //вывод цвета
    $.ajax({
        method: "GET",
        url: "color.json"
    })
        .done(function (data) {

            var value=data;
            var dataColor = block.data('color');

            for(var i=0; i<value.length; i++){

                //если значение атрибута data-color совпадает со значением name в color.json
                if(dataColor==value[i].name){

                    var colorId = value[i].id;
                    $('img').attr({src:value[i].src, alt: value[i].name});

                    //Добавляем следующий AJAX
                    //вывод размеров и цен
                    $.ajax({
                        method: "GET",
                        url: "size.json"
                    })

                        .done(function (data) {

                            var size = data;

                            var div = $('<div></div>');

                            $('.size-text').after(div);
                            $(div).addClass('card-size');

                            for(var j =0;j<size.length;j++){
                            //перебор size.json
                                if(colorId==size[j].color_id){

                                    //цена товара, согласно цвета
                                    var priceString = $('#price').html(size[j].price + '<sup>&#36;</sup>');

                                    //Вывод размеров в div
                                        for(var z=0; z<size[j].size.length; z++){
                                            var span = $('<span class="size"></span>');
                                            span.text(size[j].size[z].name);
                                            $(div).append(span);

                                            //выбор размера по клику
                                            span.bind('click',function(){

                                                var amount = $('#amount');
                                                var spanClick = $(this);
                                                amount.val('');


                                                $('.card-size>span').removeClass('active');

                                                spanClick.addClass('active');

                                                //Значение выбраного размера
                                               // alert(spanClick.text());


                                                amount.prop('disabled', false);

                                                //Выбор количества товара
                                                amount.bind('change', function(){

                                                    //Расчет общей цены товара

                                                    var tovarHow = parseInt($(this).val());
                                                    var price = parseInt(priceString.text());
                                                    var result=0;
                                                    if(tovarHow>=3){
                                                        //более 3-х товаров - скидка 25%
                                                        result = (price-(price*0.25))*tovarHow;
                                                        alert(result);
                                                    }
                                                    else{
                                                        result = price*tovarHow;
                                                        alert(result);
                                                    }

                                                });

                                                /*
                                                возникли вопросы по post-запросу
                                                 хочу сформировать json объект со следующими значениями
                                                 id - заказа, цвет - товара, размер - товара, количество, цена, наличие скидки
                                                 */

                                                $('#submit').bind('click', function(event) {
                                                  event.preventDefault();
                                                    $.ajax({
                                                        method: "POST",
                                                        url: "result.json"

                                                    })
                                                });

                                            });
                                        }
                                }
                            }
                        });
                }
            }

            });
});

formValidate();

//удаление класса active у элементов
function removeClass(){
    $('span').parent().removeClass('active');
    $('.card-size').remove();
}


//Валидация формы
function formValidate(){
    var validator = $( "#myform" ).validate({

        rules: {
            amount: {
                required: true,
                number: true,
                range: [1,99],
                maxlength: 3,
                max: 100
            }
        },
        messages: {
            amount: {
                required: "Обязательное поле!",
                number: "Проверьте правильность ввода",
                range: "Введите числа в диапазоне " + 1 + ' '+ 'до' + ' '+99,
                maxlength: "Длина строки не более 3-х символов",
                max: "Числа должны быть от 1 до" + ' ' + 100
            }
        }
    });
}

