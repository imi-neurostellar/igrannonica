using System.Text;
using api.Data;
using api.Interfaces;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
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

//Inject Dependencies
builder.Services.AddScoped<IDatasetService, DatasetService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMlConnectionService, MlConnectionService>();
builder.Services.AddScoped<IModelService, ModelService>();
builder.Services.AddScoped<IPredictorService, PredictorService>();
builder.Services.AddScoped<IFileService, FileService>();


//Add Authentication
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:JwtToken").Value)),
            ValidateIssuer=false,
            ValidateAudience=false
        };
    
    });


builder.Services.AddControllers();

var app = builder.Build();


//Add Cors
app.UseCors(
    x=>x.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    );

// Configure the HTTP request pipeline.

//Add Authentication
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
