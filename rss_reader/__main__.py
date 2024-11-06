import argparse
from rss_reader.app import app
from rss_reader import migrate, sync

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

elif command == "migrate":
    migrate.run()

elif command == "sync":
    sync.run()

else:
    print(f"unknown command {command}")
