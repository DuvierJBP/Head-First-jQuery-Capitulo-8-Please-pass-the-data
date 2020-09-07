$(document).ready(function () {
    const FREQ = 10000; // Tiempo de espera para ejecutar el setTimeOut
    var repeat = true;

    function getTime() {
        var a_p = "";
        var d = new Date();
        var curr_hour = d.getHours();

        (curr_hour < 12) ? a_p = "AM" : a_p = "PM";
        (curr_hour == 0) ? curr_hour = 12 : curr_hour = curr_hour;
        (curr_hour > 12) ? curr_hour = curr_hour - 12 : curr_hour = curr_hour;

        var curr_min = d.getMinutes().toString();
        var curr_sec = d.getSeconds().toString();

        if (curr_min.length == 1) { curr_min = "0" + curr_min; }
        if (curr_sec.length == 1) { curr_sec = "0" + curr_sec; }

        $('#updatedTime').html(curr_hour + ":" + curr_min + ":" + curr_sec + " " + a_p);
    }

    //Función para consultar los datos del archivo finishers.xml
    function getXMLRacers() {
        $.ajax({
            url: "finishers.xml",
            cache: false,
            dataType: "xml",
            success: function (xml) {
                //Aqui se limpian todos los elementos ul para actualizar los datos
                $('#finishers_m').empty();
                $('#finishers_f').empty();
                $('#finishers_all').empty();
                //Logica para caracterizar los datos por generos
                $(xml).find("runner").each(function () {
                    var info = '<li>Name: ' + $(this).find("fname").text() + ' ' + $(this).find("lname").text() + '. Time: ' + $(this).find("time").text() + '</li>';
                    if ($(this).find("gender").text() == "m") {
                        $('#finishers_m').append(info);
                    } else if ($(this).find("gender").text() == "f") {
                        $('#finishers_f').append(info);
                    } else { }
                    $('#finishers_all').append(info);
                });

                getTimeAjax(); // se lla ma nuevamente esta funcion para actualizar la pagina con los nuevos datos
            }
        });
    }

    function startAJAXcalls() {
        if (repeat) {
            setTimeout(function () {
                getXMLRacers(); //actualiza los datos del archivo .xml
                startAJAXcalls(); // Se autorreferencia para ejecutarse cada 10s
            }, FREQ);
        }
    }

    //Función para mostrar le periodo de tiempo con el que actualizan los datos de la pagina
    function showFrequency() {
        $("#freq").html("Page refreshes every " + FREQ / 1000 + " second(s).");
    }

    //Función encargada de mostrar la fecah de actualizacion de los datos
    function getTimeAjax() {
        $('#updatedTime').load("time.php");
    }

    //Detector de click para el boton btnStop para deterner las actualizaciones
    $("#btnStop").click(function () {
        repeat = false;
        $("#freq").html("Updates paused.");
    });

    //Detector de click para el boton btnStart para habilitar las actualizaciones
    $("#btnStart").click(function () {
        repeat = true;
        startAJAXcalls();
        showFrequency();
    });

    //Llamada de las funciones apenas carga la pagina.
    getXMLRacers();
    startAJAXcalls();




});
