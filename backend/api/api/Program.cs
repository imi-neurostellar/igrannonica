var builder = WebApplication.CreateBuilder(args);

//Add Cors
builder.Services.AddCors();

// Add services to the container

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
