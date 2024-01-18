from flask import Flask, render_template
from flask_sock import Sock
import os,posix,errno,sys
import json,time
import argparse

app = Flask(__name__)
sock = Sock(app)

jdsp_config = {}

pipe_file = ""
cfg_file = ""
data_root = ""
ddc_dir = ""
convolver_dir = ""

@app.route('/')
def index():
    return render_template('index.html')

@sock.route('/ctl')
def ctl(sock):
    while True:
        data = sock.receive()
        #print("Received command: " + data)
        if data == "GET_CONFIG":
            jdsp_gui_update_config()
            sock.send(json.dumps(jdsp_config))
        elif data == "GET_DDC":
            ddc = [f for f in os.listdir(ddc_dir) if os.path.isfile(os.path.join(ddc_dir, f))]
            ddc_files = {}
            ddc_files["type"] = "ddc"
            ddc_files["files"] = ddc
            ddc_files["files"].append("")
            ddc_selected = os.path.basename(jdsp_config['DDC_COEFFS'])
            ddc_files["selected"] = ddc_selected
            sock.send(json.dumps(ddc_files))
        elif data == "GET_CONVOLVER":
            irs = [f for f in os.listdir(convolver_dir) if os.path.isfile(os.path.join(convolver_dir, f))]
            irs_files = {}
            irs_files["type"] = "irs"
            irs_files["files"] = irs
            irs_files["files"].append("")
            irs_selected = os.path.basename(jdsp_config['CONVOLVER_FILE'])
            irs_files["selected"] = irs_selected
            sock.send(json.dumps(irs_files))
        elif "DDC_COEFFS=" in data:
            f = data.split("=")[1]
            jdsp_command("DDC_COEFFS=" + ddc_dir + "/" + f)
            time.sleep(0.10);
        elif "CONVOLVER_FILE=" in data:
            f = data.split("=")[1]
            jdsp_command("CONVOLVER_FILE=" + convolver_dir + "/" + f)
            time.sleep(0.10);
        else:
            jdsp_command(data)
            time.sleep(0.10);

def jdsp_command(cmd):
    try:
        fn = posix.open(pipe_file, posix.O_WRONLY | posix.O_NONBLOCK)
        with open(pipe_file, mode="wt") as f:
            f.write(cmd)
        posix.close(fn)
    except OSError as ex:
        if ex.errno == errno.ENXIO:
            pass

def jdsp_gui_update_config():
    with open(cfg_file, "r") as f:
        for line in f:
            k, v = line.split("=")
            jdsp_config[k] = v.rstrip()
        jdsp_config["type"] = "config"

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ALSA JamesDSP GUI")

    parser.add_argument("-d","--data",help="A full path to the data folder which cointains 'ddc' and 'convolver' subfolders")
    parser.add_argument("-p","--jdsp-ctl",help="A full path with the filename to the ALSA JamesDSP control pipe file")
    parser.add_argument("-c","--jdsp-config",help="A full path with the filename to the ALSA JamesDSP configuration file")
    parser.add_argument("-P","--port",help="A port number to listen for HTTP requests (default is 8383)",type=int, default=8383)

    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    data_root = args.data
    pipe_file = args.jdsp_ctl
    cfg_file = args.jdsp_config
    ddc_dir = data_root + "/ddc"
    convolver_dir = data_root + "/convolver"

    jdsp_gui_update_config()
    app.run(host="0.0.0.0", port=args.port, debug=True)
