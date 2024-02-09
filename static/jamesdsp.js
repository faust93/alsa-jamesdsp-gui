//$( function() {

var ws = null; 
var ws_connected = false;
var gui_inited = false;

function jdsp_refresh_config(e) {
    console.log("Refreshing DSP configs");
    gui_inited = false;
    if(ws_connected) {
        ws.send("GET_CONFIG");
        ws.send("GET_DDC");
        ws.send("GET_CONVOLVER");
    } else {
        ws = new WebSocket('ws://' + location.host + '/ctl');
    }
}

function jdsp_feature_enable(e) {
    if(!gui_inited)
        return;
    var val;
    if(e.checked)
        val = "1";
    else
        val = "0";
    console.log(e.id +"="+val);
    ws.send(e.id +"="+val);
    ws.send("COMMIT");
}

function jdsp_prop_change(e, ui) {
    if(!gui_inited)
        return;
    console.log(e.target.id + "=" + ui.value);
    ws.send(e.target.id +"="+ui.value);
    ws.send("COMMIT");
}

function jdsp_eq_enable(e) {
    if(!gui_inited)
        return;
    if(e.checked)
        val = "1";
    else
        val = "0";
    console.log(e.id +"="+val);
    ws.send(e.id +"="+val);
    if(e.checked) {
        var eq = "";
        eq += $( "#eq25" ).slider( "option", "value" ) + ";";
        eq += $( "#eq40" ).slider( "option", "value" ) + ";";
        eq += $( "#eq63" ).slider( "option", "value" ) + ";";
        eq += $( "#eq100" ).slider( "option", "value" ) + ";";
        eq += $( "#eq160" ).slider( "option", "value" ) + ";";
        eq += $( "#eq250" ).slider( "option", "value" ) + ";";
        eq += $( "#eq400" ).slider( "option", "value" ) + ";";
        eq += $( "#eq630" ).slider( "option", "value" ) + ";";
        eq += $( "#eq1k" ).slider( "option", "value" ) + ";";
        eq += $( "#eq2k" ).slider( "option", "value" ) + ";";
        eq += $( "#eq3k" ).slider( "option", "value" ) + ";";
        eq += $( "#eq4k" ).slider( "option", "value" ) + ";";
        eq += $( "#eq6k" ).slider( "option", "value" ) + ";";
        eq += $( "#eq10k" ).slider( "option", "value" ) + ";";
        eq += $( "#eq16k" ).slider( "option", "value" );
        ws.send("TONE_EQ=" + eq);
    }
    ws.send("COMMIT");
}

function jdsp_eq_change(e, ui) {
    if(!gui_inited)
        return;
    eqChar_update();
    var eq = "";
    eq += $( "#eq25" ).slider( "option", "value" ) + ";";
    eq += $( "#eq40" ).slider( "option", "value" ) + ";";
    eq += $( "#eq63" ).slider( "option", "value" ) + ";";
    eq += $( "#eq100" ).slider( "option", "value" ) + ";";
    eq += $( "#eq160" ).slider( "option", "value" ) + ";";
    eq += $( "#eq250" ).slider( "option", "value" ) + ";";
    eq += $( "#eq400" ).slider( "option", "value" ) + ";";
    eq += $( "#eq630" ).slider( "option", "value" ) + ";";
    eq += $( "#eq1k" ).slider( "option", "value" ) + ";";
    eq += $( "#eq2k" ).slider( "option", "value" ) + ";";
    eq += $( "#eq3k" ).slider( "option", "value" ) + ";";
    eq += $( "#eq4k" ).slider( "option", "value" ) + ";";
    eq += $( "#eq6k" ).slider( "option", "value" ) + ";";
    eq += $( "#eq10k" ).slider( "option", "value" ) + ";";
    eq += $( "#eq16k" ).slider( "option", "value" );
    ws.send("TONE_EQ=" + eq);
    ws.send("COMMIT");
    console.log("TONE_EQ=" + eq);
}

function jdsp_eq_filter_change(e) {
    if(!gui_inited)
        return;
    ws.send("TONE_FILTERTYPE=" + $( "#TONE_FILTERTYPE" ).slider( "option", "value" ));
    tone_onoff = $("#TONE_ENABLE").is(":checked");
    if(tone_onoff) {
        ws.send("TONE_ENABLE=0");
        ws.send("COMMIT");
        ws.send("TONE_ENABLE=1");
        ws.send("COMMIT");
        jdsp_eq_change(null,null);
    }
}

function jdsp_bass_prop(e, ui) {
    if(!gui_inited)
        return;
    ws.send("BASS_MODE=" + $( "#BASS_MODE" ).slider( "option", "value" ));
    ws.send("BASS_FILTERTYPE=" + $( "#BASS_FILTERTYPE" ).slider( "option", "value" ));
    ws.send("BASS_FREQ=" + $( "#BASS_FREQ" ).slider( "option", "value" ));
    ws.send("COMMIT");
}


function jdsp_ddc_select(e) {
    console.dir("DDC_COEFFS: " + e.value);
    ddc_onoff = $("#DDC_ENABLE").is(":checked");
    if(ddc_onoff)
        ws.send("DDC_ENABLE=0");
    ws.send("DDC_COEFFS=" + e.value);
    ws.send("COMMIT");
    if(ddc_onoff) {
        ws.send("DDC_ENABLE=1");
        ws.send("COMMIT");
    }
}

function jdsp_convolver_select(e) {
    console.dir("CONVOLVER_FILE: " + e.value);
    irs_onoff = $("#CONVOLVER_ENABLE").is(":checked");
    if(irs_onoff)
        ws.send("CONVOLVER_ENABLE=0");
    ws.send("CONVOLVER_FILE=" + e.value);
    ws.send("COMMIT");
    if(irs_onoff) {
        ws.send("CONVOLVER_ENABLE=1");
        ws.send("COMMIT");
    }
}

function jdsp_iirfilter_select(e) {
    console.dir("IIR_FILTER: " + e.value);
    ws.send("IIR_FILTER=" + e.value);
    ws.send("COMMIT");
}

function jdsp_ui_init() {

    $( "#IIR_FREQ" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('IIR_FREQ_V').innerText = ui.value;
        },
        value: 400,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 40000,
        animate: true
    });
    $( "#IIR_GAIN" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('IIR_GAIN_V').innerText = ui.value;
        },
        value: 10,
        orientation: "horizontal",
        range: "min",
        min: -100,
        max: 100,
        animate: true
    });
    $( "#IIR_QFACT" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('IIR_QFACT_V').innerText = ui.value;
        },
        value: 0.707,
        orientation: "horizontal",
        range: "min",
        min: 0.0,
        max: 4.0,
        step: 0.1,
        animate: true
    });

    $( "#MASTER_LIMTHRESHOLD" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('MASTER_LIMTHRESHOLD_V').innerText = ui.value;
        },
        value: -60,
        orientation: "horizontal",
        range: "min",
        min: -60,
        max: 0,
        animate: true
    });
    $( "#MASTER_LIMRELEASE" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('MASTER_LIMRELEASE_V').innerText = ui.value;
        },
        value: 1.5,
        orientation: "horizontal",
        range: "min",
        min: 1.5,
        max: 2000,
        step: 0.1,
        animate: true
    });

    $( "#TUBE_DRIVE" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('TUBE_DRIVE_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 12000,
        animate: true
    });

    $( "#BASS_MODE" ).slider({
        change: jdsp_bass_prop,
        slide: function( event, ui ) {
            document.getElementById('BASS_MODE_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 3000,
        animate: true
    });
    $( "#BASS_FREQ" ).slider({
        change: jdsp_bass_prop,
        slide: function( event, ui ) {
            document.getElementById('BASS_FREQ_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 30,
        max: 300,
        animate: true
    });
    $( "#BASS_FILTERTYPE" ).slider({
        change: jdsp_bass_prop,
        slide: function( event, ui ) {
            document.getElementById('BASS_FILTERTYPE_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1,
        animate: true
    });

    $( "#COMPRESSOR_PREGAIN" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('COMPRESSOR_PREGAIN_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 24,
        animate: true
    });
    $( "#COMPRESSOR_THRESHOLD" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('COMPRESSOR_THRESHOLD_V').innerText = ui.value;
        },
        value: -80,
        orientation: "horizontal",
        range: "min",
        min: -80,
        max: 0,
        animate: true
    });
    $( "#COMPRESSOR_KNEE" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('COMPRESSOR_KNEE_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 40,
        animate: true
    });
    $( "#COMPRESSOR_RATIO" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('COMPRESSOR_RATIO_V').innerText = ui.value;
        },
        value: -20,
        orientation: "horizontal",
        range: "min",
        min: -20,
        max: 20,
        animate: true
    });
    $( "#COMPRESSOR_ATTACK" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('COMPRESSOR_ATTACK_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 1000,
        animate: true
    });
    $( "#COMPRESSOR_RELEASE" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('COMPRESSOR_RELEASE_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 1000,
        animate: true
    });
    $( "#STEREOWIDE_MCOEFF" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('STEREOWIDE_MCOEFF_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 10000,
        animate: true
    });
    $( "#STEREOWIDE_SCOEFF" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('STEREOWIDE_SCOEFF_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 10000,
        animate: true
    });
    $( "#BS2B_FCUT" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('BS2B_FCUT_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 300,
        max: 2000,
        animate: true
    });
    $( "#BS2B_FEED" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('BS2B_FEED_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 10,
        max: 150,
        animate: true
    });
    $( "#HEADSET_OSF" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_OSF_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 4,
        animate: true
    });
    $( "#HEADSET_REFLECTION_AMOUNT" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_REFLECTION_AMOUNT_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1,
        step: 0.01,
        animate: true
    });
    $( "#HEADSET_FINALWET" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_FINALWET_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: -70,
        max: 10,
        step: 0.1,
        animate: true
    });
    $( "#HEADSET_FINALDRY" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_FINALDRY_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: -70,
        max: 10,
        step: 0.1,
        animate: true
    });
    $( "#HEADSET_REFLECTION_FACTOR" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_REFLECTION_FACTOR_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 0.5,
        max: 2.5,
        step: 0.01,
        animate: true
    });
    $( "#HEADSET_REFLECTION_WIDTH" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_REFLECTION_WIDTH_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: -1,
        max: 1,
        step: 0.01,
        animate: true
    });
    $( "#HEADSET_WIDTH" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_WIDTH_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1,
        step: 0.01,
        animate: true
    });
    $( "#HEADSET_WET" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_WET_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: -70,
        max: 10,
        step: 0.1,
        animate: true
    });
    $( "#HEADSET_LFO_WANDER" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_LFO_WANDER_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0.1,
        max: 0.6,
        step: 0.01,
        animate: true
    });
    $( "#HEADSET_BASSBOOST" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_BASSBOOST_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 0.5,
        step: 0.01,
        animate: true
    });
    $( "#HEADSET_LFO_SPIN" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_LFO_SPIN_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 10,
        step: 0.1,
        animate: true
    });
    $( "#HEADSET_DECAY" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_DECAY_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0.1,
        max: 30,
        step: 0.1,
        animate: true
    });
    $( "#HEADSET_DELAY" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_DELAY_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: -500,
        max: 500,
        animate: true
    });
    $( "#HEADSET_LPF_INPUT" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_LPF_INPUT_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 200,
        max: 18000,
        animate: true
    });
    $( "#HEADSET_LPF_BASS" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_LPF_BASS_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 500,
        max: 1050,
        animate: true
    });
    $( "#HEADSET_LPF_DAMP" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_LPF_DAMP_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 200,
        max: 18000,
        animate: true
    });
    $( "#HEADSET_LPF_OUTPUT" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('HEADSET_LPF_OUTPUT_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 200,
        max: 18000,
        animate: true
    });

    $( "#CONVOLVER_GAIN" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('CONVOLVER_GAIN_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: -80,
        max: 30,
        step: 0.1,
        animate: true
    });

    $( "#CONVOLVER_BENCH_C0" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('CONVOLVER_BENCH_C0_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0.000000,
        max: 0.001000,
        step: 0.000001,
        animate: true
    });
    $( "#CONVOLVER_BENCH_C1" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('CONVOLVER_BENCH_C1_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0.000000,
        max: 0.001000,
        step: 0.000001,
        animate: true
    });

    $( "#TONE_EQ > span" ).each(function(i, e) {
        $(e).empty().slider({
          change: jdsp_eq_change,
          value: 0,
          range: "min",
          min: -1200,
          max: 1200,
          animate: true,
          orientation: "vertical"
        });
      });
      $( "#TONE_FILTERTYPE" ).slider({
        change: jdsp_eq_filter_change,
        slide: function( event, ui ) {
            document.getElementById('TONE_FILTERTYPE_V').innerText = ui.value;
        },
        value: 0,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1,
        animate: true
    });
    $( "#SE_EXCITER" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('SE_EXCITER_V').innerText = ui.value;
        },
        value: 0.0,
        orientation: "horizontal",
        range: "min",
        min: 0.0,
        max: 50.0,
        step: 0.000001,
        animate: true
    });
    $( "#SE_REFREQ" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('SE_REFREQ_V').innerText = ui.value;
        },
        value: 7600,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 24000,
        animate: true
    });
    $( "#FSURROUND_DEPTH" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('FSURROUND_DEPTH_V').innerText = ui.value;
        },
        value: 1,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1000,
        animate: true
    });
    $( "#FSURROUND_WIDE" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('FSURROUND_WIDE_V').innerText = ui.value;
        },
        value: 0.0,
        orientation: "horizontal",
        range: "min",
        min: 0.0,
        max: 10.0,
        step: 0.000001,
        animate: true
    });
    $( "#FSURROUND_MID" ).slider({
        change: jdsp_prop_change,
        slide: function( event, ui ) {
            document.getElementById('FSURROUND_MID_V').innerText = ui.value;
        },
        value: 0.0,
        orientation: "horizontal",
        range: "min",
        min: 0.0,
        max: 10.0,
        step: 0.000001,
        animate: true
    });
}

function jdsp_update_controls(data) {
    var config = JSON.parse(data);
    if("IIR_ENABLE" in config) {
        var val = false;
        if(config.IIR_ENABLE == 1)
            val = true;
        $("#IIR_ENABLE").attr("checked", val);
    }
    if("IIR_FREQ" in config) {
        $( "#IIR_FREQ" ).slider({
            value: config.IIR_FREQ
          });
          document.getElementById('IIR_FREQ_V').innerText = config.IIR_FREQ;
    }
    if("IIR_GAIN" in config) {
        $( "#IIR_GAIN" ).slider({
            value: config.IIR_GAIN
          });
        document.getElementById('IIR_GAIN_V').innerText = config.IIR_GAIN;
    }
    if("IIR_QFACT" in config) {
        $( "#IIR_QFACT" ).slider({
            value: config.IIR_QFACT
          });
        document.getElementById('IIR_QFACT_V').innerText = config.IIR_QFACT;
    }
    if("IIR_FILTER" in config) {
        console.log("IIR_FILTER " + config.IIR_FILTER);
        $("#IIR_FILTER").val(config.IIR_FILTER);
    }
    if("FX_ENABLE" in config) {
        var val = false;
        if(config.FX_ENABLE == 1)
            val = true;
        $("#FX_ENABLE").attr("checked", val);
    }
    if("MASTER_LIMTHRESHOLD" in config) {
        $( "#MASTER_LIMTHRESHOLD" ).slider({
            value: config.MASTER_LIMTHRESHOLD
          });
          document.getElementById('MASTER_LIMTHRESHOLD_V').innerText = config.MASTER_LIMTHRESHOLD;
    }
    if("MASTER_LIMRELEASE" in config) {
        $( "#MASTER_LIMRELEASE" ).slider({
            value: config.MASTER_LIMRELEASE
          });
        document.getElementById('MASTER_LIMRELEASE_V').innerText = config.MASTER_LIMRELEASE;
    }
    if("BASS_ENABLE" in config) {
        var val = false;
        if(config.BASS_ENABLE == 1)
            val = true;
        $("#BASS_ENABLE").attr("checked", val);
    }
    if("BASS_MODE" in config) {
        $( "#BASS_MODE" ).slider({
            value: config.BASS_MODE
          });
        document.getElementById('BASS_MODE_V').innerText = config.BASS_MODE;
    }
    if("BASS_FILTERTYPE" in config) {
        $( "#BASS_FILTERTYPE" ).slider({
            value: config.BASS_FILTERTYPE
          });
       document.getElementById('BASS_FILTERTYPE_V').innerText = config.BASS_FILTERTYPE;
    }
    if("BASS_FREQ" in config) {
        $( "#BASS_FREQ" ).slider({
            value: config.BASS_FREQ
          });
        document.getElementById('BASS_FREQ_V').innerText = config.BASS_FREQ;
    }

    if("TUBE_ENABLE" in config) {
        var val = false;
        if(config.TUBE_ENABLE == 1)
            val = true;
        $("#TUBE_ENABLE").attr("checked", val);
    }
    if("TUBE_DRIVE" in config) {
        $( "#TUBE_DRIVE" ).slider({
            value: config.TUBE_DRIVE
          });
        document.getElementById('TUBE_DRIVE_V').innerText = config.TUBE_DRIVE;
    }

    if("COMPRESSOR_ENABLE" in config) {
        var val = false;
        if(config.COMPRESSOR_ENABLE == 1)
            val = true;
        $("#COMPRESSOR_ENABLE").attr("checked", val);
    }
    if("COMPRESSOR_PREGAIN" in config) {
        $( "#COMPRESSOR_PREGAIN" ).slider({
            value: config.COMPRESSOR_PREGAIN
          });
        document.getElementById('COMPRESSOR_PREGAIN_V').innerText = config.COMPRESSOR_PREGAIN;
    }
    if("COMPRESSOR_THRESHOLD" in config) {
        $( "#COMPRESSOR_THRESHOLD" ).slider({
            value: config.COMPRESSOR_THRESHOLD
          });
        document.getElementById('COMPRESSOR_THRESHOLD_V').innerText = config.COMPRESSOR_THRESHOLD;
    }
    if("COMPRESSOR_KNEE" in config) {
        $( "#COMPRESSOR_KNEE" ).slider({
            value: config.COMPRESSOR_KNEE
          });
        document.getElementById('COMPRESSOR_KNEE_V').innerText = config.COMPRESSOR_KNEE;
    }
    if("COMPRESSOR_RATIO" in config) {
        $( "#COMPRESSOR_RATIO" ).slider({
            value: config.COMPRESSOR_RATIO
          });
        document.getElementById('COMPRESSOR_RATIO_V').innerText = config.COMPRESSOR_RATIO;
    }
    if("COMPRESSOR_ATTACK" in config) {
        $( "#COMPRESSOR_ATTACK" ).slider({
            value: config.COMPRESSOR_ATTACK
          });
        document.getElementById('COMPRESSOR_ATTACK_V').innerText = config.COMPRESSOR_ATTACK;
    }
    if("COMPRESSOR_RELEASE" in config) {
        $( "#COMPRESSOR_RELEASE" ).slider({
            value: config.COMPRESSOR_RELEASE
          });
        document.getElementById('COMPRESSOR_RELEASE_V').innerText = config.COMPRESSOR_RELEASE;
    }

    if("STEREOWIDE_ENABLE" in config) {
        var val = false;
        if(config.STEREOWIDE_ENABLE == 1)
            val = true;
        $("#STEREOWIDE_ENABLE").attr("checked", val);
    }
    if("STEREOWIDE_MCOEFF" in config) {
        $( "#STEREOWIDE_MCOEFF" ).slider({
            value: config.STEREOWIDE_MCOEFF
          });
        document.getElementById('STEREOWIDE_MCOEFF_V').innerText = config.STEREOWIDE_MCOEFF;
    }
    if("STEREOWIDE_SCOEFF" in config) {
        $( "#STEREOWIDE_SCOEFF" ).slider({
            value: config.STEREOWIDE_SCOEFF
          });
        document.getElementById('STEREOWIDE_SCOEFF_V').innerText = config.STEREOWIDE_SCOEFF;
    }

    if("BS2B_ENABLE" in config) {
        var val = false;
        if(config.BS2B_ENABLE == 1)
            val = true;
        $("#BS2B_ENABLE").attr("checked", val);
    }
    if("BS2B_FCUT" in config) {
        $( "#BS2B_FCUT" ).slider({
            value: config.BS2B_FCUT
          });
        document.getElementById('BS2B_FCUT_V').innerText = config.BS2B_FCUT;
    }
    if("BS2B_FEED" in config) {
        $( "#BS2B_FEED" ).slider({
            value: config.BS2B_FEED
          });
        document.getElementById('BS2B_FEED_V').innerText = config.BS2B_FEED;
    }
    if("SE_ENABLE" in config) {
        var val = false;
        if(config.SE_ENABLE == 1)
            val = true;
        $("#SE_ENABLE").attr("checked", val);
    }
    if("SE_EXCITER" in config) {
        $( "#SE_EXCITER" ).slider({
            value: config.SE_EXCITER
          });
        document.getElementById('SE_EXCITER_V').innerText = config.SE_EXCITER;
    }
    if("SE_REFREQ" in config) {
        $( "#SE_REFREQ" ).slider({
            value: config.SE_REFREQ
          });
        document.getElementById('SE_REFREQ_V').innerText = config.SE_REFREQ;
    }
    if("FSURROUND_ENABLE" in config) {
        var val = false;
        if(config.FSURROUND_ENABLE == 1)
            val = true;
        $("#FSURROUND_ENABLE").attr("checked", val);
    }
    if("FSURROUND_DEPTH" in config) {
        $( "#FSURROUND_DEPTH" ).slider({
            value: config.FSURROUND_DEPTH
          });
        document.getElementById('FSURROUND_DEPTH_V').innerText = config.FSURROUND_DEPTH;
    }
    if("FSURROUND_WIDE" in config) {
        $( "#FSURROUND_WIDE" ).slider({
            value: config.FSURROUND_WIDE
          });
        document.getElementById('FSURROUND_WIDE_V').innerText = config.FSURROUND_WIDE;
    }
    if("FSURROUND_MID" in config) {
        $( "#FSURROUND_MID" ).slider({
            value: config.FSURROUND_MID
          });
        document.getElementById('FSURROUND_MID_V').innerText = config.FSURROUND_MID;
    }
    if("HEADSET_ENABLE" in config) {
        var val = false;
        if(config.HEADSET_ENABLE == 1)
            val = true;
        $("#HEADSET_ENABLE").attr("checked", val);
    }
    if("HEADSET_OSF" in config) {
        $( "#HEADSET_OSF" ).slider({
            value: config.HEADSET_OSF
          });
        document.getElementById('HEADSET_OSF_V').innerText = config.HEADSET_OSF;
    }
    if("HEADSET_REFLECTION_AMOUNT" in config) {
        $( "#HEADSET_REFLECTION_AMOUNT" ).slider({
            value: config.HEADSET_REFLECTION_AMOUNT
          });
        document.getElementById('HEADSET_REFLECTION_AMOUNT_V').innerText = config.HEADSET_REFLECTION_AMOUNT;
    }
    if("HEADSET_FINALWET" in config) {
        $( "#HEADSET_FINALWET" ).slider({
            value: config.HEADSET_FINALWET
          });
        document.getElementById('HEADSET_FINALWET_V').innerText = config.HEADSET_FINALWET;
    }
    if("HEADSET_FINALDRY" in config) {
        $( "#HEADSET_FINALDRY" ).slider({
            value: config.HEADSET_FINALDRY
          });
        document.getElementById('HEADSET_FINALDRY_V').innerText = config.HEADSET_FINALDRY;
    }
    if("HEADSET_REFLECTION_FACTOR" in config) {
        $( "#HEADSET_REFLECTION_FACTOR" ).slider({
            value: config.HEADSET_REFLECTION_FACTOR
          });
        document.getElementById('HEADSET_REFLECTION_FACTOR_V').innerText = config.HEADSET_REFLECTION_FACTOR;
    }
    if("HEADSET_REFLECTION_WIDTH" in config) {
        $( "#HEADSET_REFLECTION_WIDTH" ).slider({
            value: config.HEADSET_REFLECTION_WIDTH
          });
        document.getElementById('HEADSET_REFLECTION_WIDTH_V').innerText = config.HEADSET_REFLECTION_WIDTH;
    }
    if("HEADSET_WIDTH" in config) {
        $( "#HEADSET_WIDTH" ).slider({
            value: config.HEADSET_WIDTH
          });
        document.getElementById('HEADSET_WIDTH_V').innerText = config.HEADSET_WIDTH;
    }
    if("HEADSET_WET" in config) {
        $( "#HEADSET_WET" ).slider({
            value: config.HEADSET_WET
          });
        document.getElementById('HEADSET_WET_V').innerText = config.HEADSET_WET;
    }
    if("HEADSET_LFO_WANDER" in config) {
        $( "#HEADSET_LFO_WANDER" ).slider({
            value: config.HEADSET_LFO_WANDER
          });
        document.getElementById('HEADSET_LFO_WANDER_V').innerText = config.HEADSET_LFO_WANDER;
    }
    if("HEADSET_BASSBOOST" in config) {
        $( "#HEADSET_BASSBOOST" ).slider({
            value: config.HEADSET_BASSBOOST
          });
        document.getElementById('HEADSET_BASSBOOST_V').innerText = config.HEADSET_BASSBOOST;
    }
    if("HEADSET_LFO_SPIN" in config) {
        $( "#HEADSET_LFO_SPIN" ).slider({
            value: config.HEADSET_LFO_SPIN
          });
        document.getElementById('HEADSET_LFO_SPIN_V').innerText = config.HEADSET_LFO_SPIN;
    }
    if("HEADSET_DECAY" in config) {
        $( "#HEADSET_DECAY" ).slider({
            value: config.HEADSET_DECAY
          });
        document.getElementById('HEADSET_DECAY_V').innerText = config.HEADSET_DECAY;
    }
    if("HEADSET_DELAY" in config) {
        $( "#HEADSET_DELAY" ).slider({
            value: config.HEADSET_DELAY
          });
        document.getElementById('HEADSET_DELAY_V').innerText = config.HEADSET_DELAY;
    }
    if("HEADSET_LPF_INPUT" in config) {
        $( "#HEADSET_LPF_INPUT" ).slider({
            value: config.HEADSET_LPF_INPUT
          });
        document.getElementById('HEADSET_LPF_INPUT_V').innerText = config.HEADSET_LPF_INPUT;
    }
    if("HEADSET_LPF_BASS" in config) {
        $( "#HEADSET_LPF_BASS" ).slider({
            value: config.HEADSET_LPF_BASS
          });
        document.getElementById('HEADSET_LPF_BASS_V').innerText = config.HEADSET_LPF_BASS;
    }
    if("HEADSET_LPF_DAMP" in config) {
        $( "#HEADSET_LPF_BASS" ).slider({
            value: config.HEADSET_LPF_DAMP
          });
        document.getElementById('HEADSET_LPF_DAMP_V').innerText = config.HEADSET_LPF_DAMP;
    }
    if("HEADSET_LPF_OUTPUT" in config) {
        $( "#HEADSET_LPF_OUTPUT" ).slider({
            value: config.HEADSET_LPF_OUTPUT
          });
        document.getElementById('HEADSET_LPF_OUTPUT_V').innerText = config.HEADSET_LPF_OUTPUT;
    }

    if("CONVOLVER_ENABLE" in config) {
        var val = false;
        if(config.CONVOLVER_ENABLE == 1)
            val = true;
        $("#CONVOLVER_ENABLE").attr("checked", val);
    }
    if("CONVOLVER_GAIN" in config) {
        $( "#CONVOLVER_GAIN" ).slider({
            value: config.CONVOLVER_GAIN
          });
        document.getElementById('CONVOLVER_GAIN_V').innerText = config.CONVOLVER_GAIN;
    }
//    if("CONVOLVER_BENCH_C0" in config) {
//        $( "#CONVOLVER_BENCH_C0" ).val(config.CONVOLVER_BENCH_C0);
//    }
//    if("CONVOLVER_BENCH_C1" in config) {
//        $( "#CONVOLVER_BENCH_C1" ).val(config.CONVOLVER_BENCH_C1);
//    }
    if("CONVOLVER_BENCH_C0" in config) {
        $( "#CONVOLVER_BENCH_C0" ).slider({
            value: config.CONVOLVER_BENCH_C0
          });
        document.getElementById('CONVOLVER_BENCH_C0_V').innerText = config.CONVOLVER_BENCH_C0;
    }
    if("CONVOLVER_BENCH_C1" in config) {
        $( "#CONVOLVER_BENCH_C1" ).slider({
            value: config.CONVOLVER_BENCH_C1
          });
        document.getElementById('CONVOLVER_BENCH_C1_V').innerText = config.CONVOLVER_BENCH_C1;
    }

    if("TONE_ENABLE" in config) {
        var val = false;
        if(config.TONE_ENABLE == 1)
            val = true;
        $("#TONE_ENABLE").attr("checked", val);
    }
    if("TONE_EQ" in config) {
        var eq = config.TONE_EQ.split(";");
        $( "#eq25" ).slider({ value: eq[0] });
        $( "#eq40" ).slider({ value: eq[1] });
        $( "#eq63" ).slider({ value: eq[2] });
        $( "#eq100" ).slider({ value: eq[3] });
        $( "#eq160" ).slider({ value: eq[4] });
        $( "#eq250" ).slider({ value: eq[5] });
        $( "#eq400" ).slider({ value: eq[6] });
        $( "#eq630" ).slider({ value: eq[7] });
        $( "#eq1k" ).slider({ value: eq[8] });
        $( "#eq2k" ).slider({ value: eq[9] });
        $( "#eq3k" ).slider({ value: eq[10] });
        $( "#eq4k" ).slider({ value: eq[11] });
        $( "#eq6k" ).slider({ value: eq[12] });
        $( "#eq10k" ).slider({ value: eq[13] });
        $( "#eq16k" ).slider({ value: eq[14] });
        eqChar_update();
    }
    if("TONE_FILTERTYPE" in config) {
        $( "#TONE_FILTERTYPE" ).slider({
            value: config.TONE_FILTERTYPE
          });
        document.getElementById('TONE_FILTERTYPE_V').innerText = config.TONE_FILTERTYPE;
    }
}

var eqChart = null;

function eqChart_init() {
    const ctx = document.getElementById("eqChart").getContext("2d");
      eqChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [{}],
      },
      options: {
        plugins: {
            legend: {
                display: false,
        } },
        borderWidth: 3,
        borderColor: ['rgba(255, 99, 132, 1)',],
      },
    });
}

function eqChar_update() {
    eqChart.data.labels.length = 0;
    eqChart.data.labels.push("25");
    eqChart.data.datasets[0].data[0] = $( "#eq25" ).slider( "option", "value" );
    eqChart.data.labels.push("40");
    eqChart.data.datasets[0].data[1] = $( "#eq40" ).slider( "option", "value" );
    eqChart.data.labels.push("63");
    eqChart.data.datasets[0].data[2] = $( "#eq63" ).slider( "option", "value" );
    eqChart.data.labels.push("100");
    eqChart.data.datasets[0].data[3] = $( "#eq100" ).slider( "option", "value" );
    eqChart.data.labels.push("160");
    eqChart.data.datasets[0].data[4] = $( "#eq160" ).slider( "option", "value" );
    eqChart.data.labels.push("250");
    eqChart.data.datasets[0].data[5] = $( "#eq250" ).slider( "option", "value" );
    eqChart.data.labels.push("400");
    eqChart.data.datasets[0].data[6] = $( "#eq400" ).slider( "option", "value" );
    eqChart.data.labels.push("630");
    eqChart.data.datasets[0].data[7] = $( "#eq630" ).slider( "option", "value" );
    eqChart.data.labels.push("1k");
    eqChart.data.datasets[0].data[8] = $( "#eq1k" ).slider( "option", "value" );
    eqChart.data.labels.push("2k");
    eqChart.data.datasets[0].data[9] = $( "#eq2k" ).slider( "option", "value" );
    eqChart.data.labels.push("3k");
    eqChart.data.datasets[0].data[10] = $( "#eq3k" ).slider( "option", "value" );
    eqChart.data.labels.push("4k");
    eqChart.data.datasets[0].data[11] = $( "#eq4k" ).slider( "option", "value" );
    eqChart.data.labels.push("6k");
    eqChart.data.datasets[0].data[12] = $( "#eq6k" ).slider( "option", "value" );
    eqChart.data.labels.push("10k");
    eqChart.data.datasets[0].data[13] = $( "#eq10k" ).slider( "option", "value" );
    eqChart.data.labels.push("16k");
    eqChart.data.datasets[0].data[14] = $( "#eq16k" ).slider( "option", "value" );
    eqChart.update();
}

function ws_connect() {
    ws.onopen = function (event) {
        ws_connected = true;
        console.log('WebSocket connection ready. Fetching DSP config.');
        ws.send("GET_CONFIG");
        ws.send("GET_DDC");
        ws.send("GET_CONVOLVER");
    }
    ws.addEventListener("error", (event) => {
        console.log("WebSocket error: ", event);
        ws_connect = false;
    });
    ws.addEventListener("close", (event) => {
        console.log("WebSocket connection has been closed successfully.");
        ws_connected = false;
    });
    ws.addEventListener('message', (event) => {
        var msg = JSON.parse(event.data);
        if("type" in msg) {
            console.log(msg.type + " received");
            if(msg.type == "config"){
                jdsp_update_controls(event.data);
                gui_inited = true;
            } else if(msg.type == "ddc") {
                var ddc_coeffs = document.getElementById('DDC_COEFFS');
                while ( ddc_coeffs.childNodes.length >= 1 )
                {
                    ddc_coeffs.removeChild(ddc_coeffs.firstChild);       
                }
                msg.files.forEach((file) => {
                    newOption = document.createElement('option');
                    newOption.value=file;
                    newOption.text=file;
                    if(file == msg.selected)
                        newOption.selected = true;
                    ddc_coeffs.appendChild(newOption);
                   });
            } else if(msg.type == "irs") {
                var irs_file = document.getElementById('CONVOLVER_FILE');
                while ( irs_file.childNodes.length >= 1 )
                {
                    irs_file.removeChild(irs_file.firstChild);       
                }
                msg.files.forEach((file) => {
                    newOption = document.createElement('option');
                    newOption.value=file;
                    newOption.text=file;
                    if(file == msg.selected)
                        newOption.selected = true;
                    irs_file.appendChild(newOption);
                   });
            }
        }
    });

//      exampleSocket.onmessage = function (event) {
//        console.log('message event data looks like this: ', event.data)
//      }
//        if (exampleSocket.readyState  === 1) {
//        console.log("It is safe to send messages now")
//        }
}

$(document).ready(function () {
    console.log("Ready");
    ws = new WebSocket('ws://' + location.host + '/ctl');
    ws_connect();
    jdsp_ui_init();
    eqChart_init();
});

//});