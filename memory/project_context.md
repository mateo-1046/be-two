---
name: Project Context
description: be-two is the second backend workshop covering NestJS + MongoDB with Mongoose
type: project
---

be-two is the second workshop activity in a backend teaching series.

**Why:** Builds on be-one (NestJS basics + class-validator). be-two introduces real database persistence with MongoDB and Mongoose.

**Topics covered in be-two:**
- MongooseModule.forRoot/forFeature, @Schema, @Prop, SchemaFactory
- @InjectModel dependency injection
- Full CRUD against MongoDB (find, findById, create, updateOne, deleteOne)
- Error handling: MongoDB error code 11000 (duplicate key), isValidObjectId
- Custom Pipe: ParseMongoIdPipe
- D.R.Y. pattern: private handleException method
- Environment variables: @nestjs/config, ConfigModule.forRoot, forRootAsync vs forRoot
- Logger with context string
- app.setGlobalPrefix, app.enableCors

**Domain:** Cars (Lightning McQueen theme) — Car entity has nombre, modelo, anio, frase

**Workshop structure (same as be-one):**
- src/cars/ — complete reference module (students read)
- src/bikes/ — partial module (students complete: DTOs, service methods, HTTP decorators)
- Activity 3 — students build pilotos module from scratch

**Extra section added (user request):**
- Docker vs MongoDB Atlas section with step-by-step for both options
- .env.template shows both URL formats

**Reference repo (be-one):** https://github.com/cristianABC/be-one/tree/master

**How to apply:** When creating be-three content, build on these topics (e.g., relations, auth, TypeORM/Postgres).
