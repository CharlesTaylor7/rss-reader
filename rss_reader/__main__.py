import argparse

parser = argparse.ArgumentParser()
parser.add_argument("command")
args = parser.parse_args()
command = args.command

if command == "dev-server":
    from rss_reader.app import app
    app.run(debug=True, host="0.0.0.0", port=8000)

elif command == "migrate":
    from rss_reader import migrate
    migrate.run()

elif command == "sync":
    from rss_reader.sync import Sync
    Sync(use_cache=True).run()

else:
    print(f"unknown command {command}")
