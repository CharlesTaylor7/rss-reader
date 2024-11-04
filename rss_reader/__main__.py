from waitress import serve
from rss_reader.app import app
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("command")
args = parser.parse_args()
command = args.command

spec = {
    'host': "0.0.0.0",
    'port': 8080,
}

if command == "dev-server":
    app.run(debug=True, **spec)

elif command =="prod-server":
    serve(app, **spec)

elif command == "migrate":
    from rss_reader.migrate import run
    run()

elif command == "sync":
    from rss_reader.sync import run
    run()

else:
    print(f"unknown command {command}")
