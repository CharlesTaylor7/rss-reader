# Step 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app/RssReader
COPY RssReader/*.csproj .
RUN dotnet restore
COPY RssReader/. .
RUN dotnet publish -c Release -o /app/out

# Step 2: Use runtime image for production
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "RssReader.dll"]
