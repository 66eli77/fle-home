
function get_validated_amount() {

    var amount = 0;

    if ($(".active").val() == "custom") {  //Check if 'other' input field is active
        amount = $("#InputAmount").val();
        amount = parseInt(amount.replace(",", "")).toString();
    } else { //If 'other' is not active
        amount = $(".active").val();
    }

    if (!amount.match(/^[0-9]+$/) || (parseFloat(amount) <= 0 || parseFloat(amount) > 50000)) {
        $('.alert-text').show();
        amount = 0;
    }

    return amount;

}

$(function() {
    var btn_card = $('#btn-card');
    var btn_paypal = $('#btn-paypal');
    var input_field = $('#InputAmount');

    //"Other"input field slides down
    $("#other-amount").click(function() {
        $("#input-amount").slideDown(); //input fild slides down

        input_field.focus(); //cursor goes to text-field

    });

    //Setting payment buttons to disable when input is invalid
    input_field.keyup(function() {

        var valid_amount = get_validated_amount() > 0;

        btn_card.prop('disabled', !valid_amount);
        btn_paypal.prop('disabled', !valid_amount);
        $('.alert-text').toggle(!valid_amount);

    });

    //Click of donation-amount buttons toggle button-pressed effect
    $(".btn-amount").click(function() {
        $(this).toggleClass('active').siblings().removeClass("active");
    });

    //Click stores value of preset $20, $50, $100 is stored
    $(".btn-amount-number").click(function() {
        var amount = $(this).attr("value");
    });

    //Hides the other input box when $20, $50, $100 is selected
    $(".btn-amount-number").click(function() {
        $("#input-amount").slideUp();
        $('.alert-text').hide();
        btn_card.prop('disabled', false);
        btn_paypal.prop('disabled', false);
    });

});


//Stripe
$(function() {

    var btn_card = $('#btn-card');
    var btn_paypal = $('#btn-paypal');
    var input_field = $('#InputAmount');

    input_field.keypress(function(ev) {
        var key = ev.charCode ? ev.charCode : ev.keyCode;
        // submit if enter is pressed
        if (key == 13) {
            btn_card.click();
        }
        // don't allow characters other than numbers
        if (key > 31 && (key < 48 || key > 57)) {
            ev.preventDefault();
            return false;
        }
    });

    //Stripe Integration
    var handler = StripeCheckout.configure({
        key: STRIPE_PUBLISHABLE_API_KEY ,
        image: '/static/img/le_logo.png' ,
        locale: 'auto',
        zipCode: true,
        token: function(data) {

            // add in some data we need on the backend for recurring billing
            data.amount = get_validated_amount();
            data.recurring = $('#monthly-checkbox').prop('checked');

            $.ajax({
                method: "POST",
                url: "/donate/process/",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", csrfmiddlewaretoken);
                },
                success: function() {
                    window.location.assign("/donate/thankyou/");
                }
            }).then(function(response) {
                show_message(response.status, response.message, "transaction-message");
            });
        }
    });

    //'Pay by Card' is clicked
    btn_card.on('click', function(e) {

        // update monthlyGiving boolean
        monthlyGiving = $('#monthly-checkbox').prop('checked');

        var amount = get_validated_amount();

        if (!amount) {
            return;
        }

        handler.open({
            name: 'Learning Equality',
            description: 'Donation',
            amount: parseInt(amount) * 100,
            panelLabel: monthlyGiving ? "Give monthly" : "Give"
        });

    });

    // Close Checkout on page navigation
    $(window).on('popstate', function() {
        handler.close();
    });

    //Paypal Integration
    btn_paypal.click(function() {

        $('button[data-loading-text]')
            .on('click', function() {
                var btn = $(this);
                btn.button('loading');
                setTimeout(function() {
                    btn.button('reset')
                }, 3000)
            });

        // update monthlyGiving boolean
        monthlyGiving = $('#monthly-checkbox').prop('checked');

        var amount = get_validated_amount();

        if (!amount) {
            return;
        }

        if (monthlyGiving) {
            $('input:hidden[name=a3]').val(amount);
            $('#paypal_monthly').submit();
        } else {
            $('input:hidden[name=amount]').val(amount);
            $('#paypal_once').submit();
        }

    });
});

//Progress circle animation
$(function() {
    var times = 0;

    $('.guarantee').waypoint(function(direction){

        if (direction === 'down' && times == 0){

            var bar = new ProgressBar.Circle('#circle-stats', {
                color: '#FFFFFF',
                // This has to be the same size as the maximum width to
                // prevent clipping
                strokeWidth: 4,
                trailWidth: 0,
                easing: 'easeInOut',
                duration: 1400,
                text: {
                    autoStyleContainer: false
                },
                from: { color: '#FFFFFF', width: 0 },
                to: { color: '#FFFFFF', width: 4 },
                // Set default step function for all animate calls
                step: function(state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    circle.path.setAttribute('stroke-width', state.width);

                    var value = Math.round(circle.value() * 100);
                    if (value === 0) {
                        circle.setText('');
                    } else {
                        circle.setText(value + "<html>% <br> Guarantee</html>" );
                    }
                }
            });

            bar.text.style.position = 'relative';
            bar.text.style.top = '-129px';

            bar.animate(1.0);  // Number from 0.0 to 1.0
        }

        times =+ 1;
    }, {
        offset: '60%'
    })
});
