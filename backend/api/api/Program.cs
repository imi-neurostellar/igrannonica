using api.Data;
using api.Interfaces;
using api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

//Add Cors
builder.Services.AddCors();

// Add services to the container
//dodajemo dep inj

builder.Services.Configure<UserStoreDatabaseSettings>(
    builder.Configuration.GetSection(nameof(UserStoreDatabaseSettings)));

builder.Services.AddSingleton<IUserStoreDatabaseSettings>(sp =>
    sp.GetRequiredService<IOptions<UserStoreDatabaseSettings>>().Value);

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(builder.Configuration.GetValue<string>("UserStoreDatabaseSettings:ConnectionString")));

builder.Services.AddScoped<IUserService, UserService>();
 

builder.Services.AddControllers();

var app = builder.Build();


//Add Cors
app.UseCors(
    x=>x.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    );

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();
