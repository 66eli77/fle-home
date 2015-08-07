var svg_cc = Snap("#svg_content_curation");

var line_1 = svg_cc.line(400, 230, 270, 0).attr({strokeWidth: 15, stroke: "white"});
var circle_1 = svg_cc.circle(270, 0, 50).attr({fill: 'pink', stroke: 'white', strokeWidth: 15});

var line_2 = svg_cc.line(400, 230, 160, 220).attr({strokeWidth: 15, stroke: "white"});
var circle_2 = svg_cc.circle(160, 220, 80).attr({fill: 'yellow', stroke: 'white', strokeWidth: 15});

var line_3 = svg_cc.line(400, 230, 580, 420).attr({strokeWidth: 15, stroke: "white"});
var circle_3 = svg_cc.circle(580, 420, 70).attr({fill: '#66CCFF', stroke: 'white', strokeWidth: 15});

var line_4 = svg_cc.line(400, 230, 280, 420).attr({strokeWidth: 15, stroke: "white"});
var circle_4 = svg_cc.circle(280, 420, 50).attr({fill: 'grey', stroke: 'white', strokeWidth: 15});

var line_5 = svg_cc.line(400, 230, 600, 20).attr({strokeWidth: 15, stroke: "white"});
var circle_5 = svg_cc.circle(600, 20, 80).attr({fill: 'orange', stroke: 'white', strokeWidth: 15});


var center_circle = svg_cc.circle(400, 230, 100).attr({fill: '#8AE65C', stroke: 'white', strokeWidth: 15});
var center_text = svg_cc.text(335, 290, "💡").attr({'fill-opacity': 0, "font-size": "130px"});
var expand_count = 0;
var concentrate_count = 0;

animate_concentrate(circle_1, circle_1.getBBox().cx, circle_1.getBBox().cy, line_1);
animate_concentrate(circle_2, circle_2.getBBox().cx, circle_2.getBBox().cy, line_2);
animate_concentrate(circle_3, circle_3.getBBox().cx, circle_3.getBBox().cy, line_3);
animate_concentrate(circle_4, circle_4.getBBox().cx, circle_4.getBBox().cy, line_4);
animate_concentrate(circle_5, circle_5.getBBox().cx, circle_5.getBBox().cy, line_5);

function animate_concentrate(element, x, y, line) {
    line.animate({x2: 400, y2: 230}, 1000, mina.backin);
    element.animate({cx: 400, cy: 230}, 1000, mina.backin, function(){
        expand_count++;
        if(expand_count ==  5){
            expand_count = 0;
            center_circle.animate({'fill': 'white'}, 300, mina.easein);
            center_text.animate({'fill-opacity': 1}, 300, mina.easein);
        }
        element.attr({opacity: 0});
        element.animate({cx: x, cy: y}, 1000, function(){
            concentrate_count++;
            if(concentrate_count == 5){
                concentrate_count = 0;
                center_circle.animate({'fill': '#8AE65C'}, 500, mina.easeout);
                center_text.animate({'fill-opacity': 0}, 500, mina.easeout);
            }
            line.animate({x2: x, y2: y}, 1000, mina.backin);
            element.animate({opacity: 1}, 1000, function(){
                animate_concentrate(element, x, y, line);
            });
        });
    });
}