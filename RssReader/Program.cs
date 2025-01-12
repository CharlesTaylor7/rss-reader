using System.Net;
using RssReader.Models;
using RssReader.Services;
using Serilog;
using Serilog.Enrichers.CallerInfo;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog();
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .Enrich.WithCallerInfo(
        includeFileInfo: true,
        assemblyPrefix: "RssReader.",
        prefix: "",
        filePathDepth: 3,
        excludedPrefixes: []
    )
    .WriteTo.Console(
        outputTemplate: "{Timestamp:HH:mm:ss} [{Level:u3}] {Message} (Method: {Caller}){NewLine}{Exception}"
    )
    .CreateLogger();

// Dependency injection
builder.Services.AddRazorPages();
builder.Services.AddDbContext<RssReaderContext>();
builder.Services.AddScoped<IBlogImportService, BlogImportService>();
builder.Services.AddScoped<ISyncFeedService, SyncFeedService>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Any, 8080);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages().WithStaticAssets();

app.Run();
