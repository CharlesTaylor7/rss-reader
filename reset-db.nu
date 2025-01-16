cd RssReader/
try { rm ../data/rss-reader.db* }
try { rm -r Migrations/ }
dotnet ef migrations add Initial
