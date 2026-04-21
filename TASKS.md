# Validation Questions — be-two

**Instructions:** To answer these questions you need to read the project source files. Do not look for the answer online — read it in the code and reason through the execution flow.

---

## Question 1

Read `cars/entities/car.entity.ts`. The `nombre` field has `@Prop({ unique: true, index: true })`.

A student creates a car with `nombre: "McQueen"` (uppercase). Then tries to create another with `nombre: "mcqueen"` (lowercase). Does MongoDB consider them duplicates?

Now find the line in `cars.service.ts` that directly affects this behavior. What does that line do exactly, and which method is it in? What is the consequence of that line on the `unique` constraint?

---

## Question 2

In `cars.service.ts`, the `findOne` method validates the ID with `isValidObjectId(id)` inside the service. But the `remove` method uses `ParseMongoIdPipe` in the controller.

Why do both validations exist? What would happen if:

- `findOne` did not have the `isValidObjectId` check and received `"abc"` as an id?
- `remove` did not use `ParseMongoIdPipe` and received `"abc"` as an id?

What HTTP response would the client receive in each case, and why are they different?

---

## Question 3

Look at the `create` method in `cars.service.ts`. It has a `try/catch` block. The `findAll` method has none.

Why does `create` need `try/catch` but `findAll` does not? What type of database error can `create` throw that `findAll` would never throw? If you remove the `try/catch` from `create` and MongoDB throws error 11000, what HTTP status would the client receive — 400, 500, or something else? Reason through this by reading the code.

---

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

---

## Question 5

`app.module.ts` uses `MongooseModule.forRootAsync` instead of `MongooseModule.forRoot`.

If you changed the code to:

```typescript
MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost:27017/nest-cars'),
```

What is the problem with this version? At what exact moment does JavaScript evaluate the expression `process.env.MONGODB_URL`? Why does `forRootAsync` with `useFactory` solve that problem?

---

## Question 6

Check `cars.module.ts`. The `Car` schema is registered with `MongooseModule.forFeature`. Now check `app.module.ts` — `CarsModule` is in the `imports` array.

A student forgets to import `CarsModule` in `AppModule` but leaves everything else the same. Describe what happens when the app starts. Is there an error? Does it appear at startup or on the first request?

A second student does import `CarsModule` in `AppModule` but forgets `MongooseModule.forFeature` inside `CarsModule`. What error occurs now, and which file would you look at to diagnose it?

---

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

---

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

---