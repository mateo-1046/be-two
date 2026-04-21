
## Question 1

Read `cars/entities/car.entity.ts`. The `nombre` field has `@Prop({ unique: true, index: true })`.

A student creates a car with `nombre: "McQueen"` (uppercase). Then tries to create another with `nombre: "mcqueen"` (lowercase). Does MongoDB consider them duplicates?

Now find the line in `cars.service.ts` that directly affects this behavior. What does that line do exactly, and which method is it in? What is the consequence of that line on the `unique` constraint?

Rta:// MongoDB diferencia entre mayúsculas y minúsculas, por lo que inicialmente los valores "McQueen" y "mcqueen" no serían considerados duplicados. Sin embargo, en el método create de cars.service.ts se encuentra la línea createCarDto.nombre = createCarDto.nombre.toLowerCase();, la cual transforma el valor a minúsculas antes de almacenarlo. Esto implica que ambos valores terminan siendo "mcqueen" en la base de datos. Como resultado, el índice unique sí detecta un duplicado y lanza un error. En consecuencia, aunque MongoDB es case-sensitive, el código fuerza un comportamiento case-insensitive para este campo.



## Question 2

In `cars.service.ts`, the `findOne` method validates the ID with `isValidObjectId(id)` inside the service. But the `remove` method uses `ParseMongoIdPipe` in the controller.

Why do both validations exist? What would happen if:

- `findOne` did not have the `isValidObjectId` check and received `"abc"` as an id?
- `remove` did not use `ParseMongoIdPipe` and received `"abc"` as an id?

What HTTP response would the client receive in each case, and why are they different?

Rta:// Las dos validaciones existen porque se aplican en diferentes niveles de la aplicación. En el método findOne, la validación con isValidObjectId se realiza dentro del servicio para evitar que MongoDB reciba un id inválido. Si esta validación no existiera y se enviara un valor como "abc", la consulta fallaría internamente y generaría un error no controlado, resultando en una respuesta HTTP 500. Por otro lado, en el método remove, la validación se realiza en el controlador mediante ParseMongoIdPipe, interceptando el error antes de que llegue al servicio. Si el pipe no se usara, la operación de eliminación simplemente no encontraría ningún documento, retornando deletedCount = 0 y generando un HTTP 400. La diferencia en los códigos de respuesta se debe a que en un caso el error es interno (500) y en el otro es una condición controlada del cliente (400).


## Question 3

Look at the `create` method in `cars.service.ts`. It has a `try/catch` block. The `findAll` method has none.

Why does `create` need `try/catch` but `findAll` does not? What type of database error can `create` throw that `findAll` would never throw? If you remove the `try/catch` from `create` and MongoDB throws error 11000, what HTTP status would the client receive — 400, 500, or something else? Reason through this by reading the code.

Rta:// El método create requiere un bloque try/catch porque puede generar errores relacionados con restricciones de la base de datos, especialmente el error 11000 de MongoDB, que ocurre cuando se viola un índice único. En contraste, el método findAll solo realiza una lectura y no puede provocar este tipo de errores, por lo que no necesita manejo explícito. Si se eliminara el try/catch en create y ocurriera un error de duplicado, NestJS no lo transformaría en una excepción controlada y respondería con un HTTP 500. En cambio, con el try/catch, el error se maneja correctamente como un HTTP 400, indicando que el problema está en la solicitud del cliente.


## Question 4

Read the `update` method in `cars.service.ts`:

```typescript
const car = await this.findOne(id);
try {
  await car.updateOne(updateCarDto);
  return { ...car.toJSON(), ...updateCarDto };
}
```

The code merges `car.toJSON()` with `...updateCarDto` via spread instead of calling `findById(id)` again after the update.

How many database queries does this method make in total (excluding error paths)? Can there be a difference between what the API returns and what is actually stored in MongoDB? Name one concrete scenario where that difference would cause a problem.

Rta:// El método update realiza dos consultas a la base de datos: primero una llamada a findOne(id) para verificar que el documento existe, y luego un updateOne para aplicar los cambios. Posteriormente, en lugar de consultar nuevamente la base de datos, el método construye la respuesta combinando el objeto original con los nuevos datos. Esto puede generar inconsistencias entre lo que se devuelve al cliente y lo que realmente se almacena en MongoDB. Por ejemplo, si el esquema tiene valores por defecto, middlewares o transformaciones automáticas, estos no se reflejarán en la respuesta. En ese caso, el cliente recibiría una versión que no coincide completamente con el estado real del documento.

## Question 5

`app.module.ts` uses `MongooseModule.forRootAsync` instead of `MongooseModule.forRoot`.

If you changed the code to:

```typescript
MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost:27017/nest-cars'),
```

What is the problem with this version? At what exact moment does JavaScript evaluate the expression `process.env.MONGODB_URL`? Why does `forRootAsync` with `useFactory` solve that problem?

Rta:// El problema de usar MongooseModule.forRoot con process.env.MONGODB_URL es que esta expresión se evalúa en el momento en que el archivo se carga, antes de que NestJS haya terminado de inicializar el entorno y cargar completamente las variables de configuración. Esto puede provocar que el valor sea undefined o incorrecto. En cambio, forRootAsync con useFactory retrasa la ejecución hasta el momento en que la aplicación ya está inicializada, asegurando que las variables de entorno estén disponibles. De esta forma se evita un problema de timing en la configuración.


## Question 6

Check `cars.module.ts`. The `Car` schema is registered with `MongooseModule.forFeature`. Now check `app.module.ts` — `CarsModule` is in the `imports` array.

A student forgets to import `CarsModule` in `AppModule` but leaves everything else the same. Describe what happens when the app starts. Is there an error? Does it appear at startup or on the first request?

A second student does import `CarsModule` in `AppModule` but forgets `MongooseModule.forFeature` inside `CarsModule`. What error occurs now, and which file would you look at to diagnose it?

Rta:// Si CarsModule no se importa en AppModule, la aplicación se inicia sin errores, pero las rutas asociadas a ese módulo no se registran, por lo que cualquier petición a esos endpoints devolverá un HTTP 404. En cambio, si el módulo sí está importado pero se omite MongooseModule.forFeature, NestJS no podrá inyectar el modelo en el servicio, generando un error en tiempo de arranque. Este error suele indicar que no se pueden resolver las dependencias del servicio. Para diagnosticarlo, se debe revisar el archivo cars.module.ts, donde se registra el esquema.

## Question 7

Read the `remove` method in the service:

```typescript
async remove(id: string) {
  const { deletedCount } = await this.carsModel.deleteOne({ _id: id });
  if (deletedCount === 0) {
    throw new BadRequestException(`Car with id ${id} not found`);
  }
  return;
}
```

This method does not call `findOne(id)` first — it goes straight to `deleteOne`. What is the advantage of this approach over calling `findOne` before deleting?

The DELETE endpoint uses `ParseMongoIdPipe`, so `id` always arrives as a valid ObjectId format. Under what exact condition can `deletedCount` still be `0`?

Rta:// El método remove utiliza directamente deleteOne, lo que permite realizar la eliminación en una sola consulta, evitando una búsqueda previa y mejorando la eficiencia. Aunque el endpoint garantiza que el id tenga un formato válido mediante ParseMongoIdPipe, el valor de deletedCount puede ser 0 si no existe ningún documento con ese id en la base de datos. En ese caso, el método lanza una excepción indicando que el recurso no fue encontrado, manejando correctamente la situación sin necesidad de una consulta adicional.

## Question 8

Look at `parse-mongo-id.pipe.ts`. The pipe implements `PipeTransform` and has `@Injectable()`.

If a student moves the pipe logic directly into the service instead of using it as a pipe (removing `@Injectable()` and not using it in the controller), what architectural advantage is lost? At what point in the request lifecycle does the pipe execute, compared to if the same validation were in the service?

Now, what happens if the pipe is used as `@Param('id', ParseMongoIdPipe)` but `@Injectable()` is removed from the pipe? Can NestJS still instantiate the pipe?

---

## Question 9

In `main.ts` these three lines appear in this order:

```typescript
app.setGlobalPrefix('api');
app.enableCors();
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```

A teammate reorders the code and places `app.useGlobalPipes(...)` as the first line after `NestFactory.create(AppModule)`, before `setGlobalPrefix` and `enableCors`.

Does the app behavior change? Why or why not?

Second scenario: another teammate moves `app.enableCors()` to after `app.listen()`. Does that affect anything? Explain the exact moment at which `enableCors` must be registered for it to work correctly.
