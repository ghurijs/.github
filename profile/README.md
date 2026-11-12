<p align="center">
  <a href="https://ghurijs.github.io/docs/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ghurijs/.github/main/brand/logo-dark.svg">
      <img alt="Ghuri" src="https://raw.githubusercontent.com/ghurijs/.github/main/brand/logo-light.svg" width="340">
    </picture>
  </a>
</p>

<h3 align="center">Django for TypeScript. Cloudflare first, portable everywhere.</h3>

<p align="center">
  <a href="https://ghurijs.github.io/docs/"><b>Documentation</b></a> ·
  <a href="https://ghurijs.github.io/docs/tutorial/part-1-models/">Tutorial</a> ·
  <a href="https://ghurijs.github.io/docs/django-developers/">Coming from Django?</a> ·
  <a href="https://github.com/ghurijs/examples">Examples</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@ghuri/core"><img alt="npm" src="https://img.shields.io/npm/v/@ghuri/core?label=%40ghuri%2Fcore&color=e8590c"></a>
  <img alt="status: alpha" src="https://img.shields.io/badge/status-alpha-ffd8a8">
  <img alt="license: MIT" src="https://img.shields.io/badge/license-MIT-57534e">
</p>

---

**Ghuri** (ঘুড়ি, Bengali for *kite*) gives you the shape of Django — settings, installed apps,
models with managers, migrations, `urls.ts`, class-based views, an admin, a REST framework,
GraphQL — in strict TypeScript, built on [Hono](https://hono.dev) and [Drizzle](https://orm.drizzle.team).

New projects run on **Cloudflare Workers with D1, R2 and KV**, which costs close to nothing while
you find out if anyone wants what you're building. When you outgrow it, point `DATABASES` at
Postgres, run `ghuri migrate`, copy your data, and deploy the same code to Node on any server.
No rewrite.

```ts
export class Post extends Model({
  title: new CharField({ maxLength: 200 }),
  author: new ForeignKey(() => User, { onDelete: CASCADE, relatedName: 'posts' }),
  createdAt: new DateTimeField({ autoNowAdd: true }),
}) {
  static Meta = { ordering: ['-createdAt'] }
}

admin.site.register(Post)

const recent = await Post.objects
  .filter({ author__username: 'rifat', title__icontains: 'workers' })
  .selectRelated('author')
  .slice(0, 10)
```

### Get started

```bash
npm create ghuri@latest mysite
cd mysite
npx ghuri migrate && npx ghuri createsuperuser
npm run dev        # → http://localhost:8787/admin/
```

### Packages

| | Package | |
|---|---|---|
| 🧩 | [`@ghuri/core`](https://github.com/ghurijs/core) | Settings, apps, URLs, views, middleware, signals, cache, commands |
| 🗄️ | [`@ghuri/orm`](https://github.com/ghurijs/orm) | Models, QuerySets, relations, migrations on D1, SQLite and Postgres |
| 🔐 | [`@ghuri/auth`](https://github.com/ghurijs/auth) | Users, groups, permissions, sessions, tokens, JWT |
| 🛠️ | [`@ghuri/admin`](https://github.com/ghurijs/admin) | The Django admin, server-rendered on Workers |
| 🔌 | [`@ghuri/rest`](https://github.com/ghurijs/rest) | Serializers, viewsets, routers, permissions, pagination, OpenAPI |
| 🕸️ | [`@ghuri/graphql`](https://github.com/ghurijs/graphql) | graphene-django style schemas, Relay connections, GraphiQL |
| 📦 | [`@ghuri/storage`](https://github.com/ghurijs/storage) | R2, S3 and filesystem backends, `FileField` / `ImageField` |
| 🤖 | [`@ghuri/agents`](https://github.com/ghurijs/agents) | AI agents with tools from your models and viewsets, MCP server |
| ⌨️ | [`@ghuri/cli`](https://github.com/ghurijs/cli) | `startproject`, `startapp`, `makemigrations`, `migrate`, … |
| 🪁 | [`create-ghuri`](https://github.com/ghurijs/create-ghuri) | `npm create ghuri@latest` |

### Repositories

- [**ghuri**](https://github.com/ghurijs/ghuri) — the meta repo: architecture spec and development workspace. Start here to contribute.
- [**docs**](https://github.com/ghurijs/docs) — source for [ghurijs.github.io/docs](https://ghurijs.github.io/docs/).
- [**examples**](https://github.com/ghurijs/examples) — example projects that double as end-to-end tests.

Ghuri is in **alpha**: APIs may change before 1.0. Issues, ideas and pull requests are welcome. MIT licensed.
