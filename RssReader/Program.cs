using System.Net;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;
using RssReader.Services;
using Serilog;
using Serilog.Enrichers.CallerInfo;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog(
    (context, services, configuration) =>
        configuration
            .ReadFrom.Configuration(context.Configuration)
            .Enrich.FromLogContext()
            .Enrich.WithCallerInfo(
                includeFileInfo: true,
                assemblyPrefix: "RssReader.",
                prefix: "",
                filePathDepth: 3,
                excludedPrefixes: []
            )
            .WriteTo.File("../logs/app.log", rollingInterval: RollingInterval.Day) // Output logs to a file
            .WriteTo.Console(
                outputTemplate: "{Timestamp:HH:mm:ss} [{Level:u3}] {Message} (Method: {Caller}){NewLine}{Exception}"
            )
);

builder.Services.AddRazorPages();
builder
    .Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login";
    });

/* FIXME: implement auth
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
});
*/
builder.Services.AddHttpClient();
builder.Services.AddHttpClient<ISyncFeedService>(client =>
{
    client.DefaultRequestHeaders.Add(
        "Accept",
        "application/xml, application/rss+xml, application/atom+xml"
    );
});
builder.Services.AddDbContext<RssReaderContext>();
builder.Services.AddScoped<IBlogImportService, BlogImportService>();
builder.Services.AddScoped<ISyncFeedService, SyncFeedService>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Any, 8080);
});

var app = builder.Build();

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<RssReaderContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapStaticAssets();
app.MapRazorPages().WithStaticAssets();

app.Run();
