import argparse

parser = argparse.ArgumentParser()
parser.add_argument("command")
args = parser.parse_args()
command = args.command

if command == "dev-server":
    import os
    from rss_reader.app import app
    os.environ['DEV_CACHE'] = True
    app.run(debug=True, host="0.0.0.0", port=8080)

elif command == "migrate":
    from rss_reader import migrate
    migrate.run()

elif command == "sync":
    from rss_reader import sync
    os.environ['DEV_CACHE'] = True
    sync.run()

else:
    print(f"unknown command {command}")
