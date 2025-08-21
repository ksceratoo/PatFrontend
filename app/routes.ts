import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("about/behavioural", "routes/about/behavioural.tsx"),
  route("about/calculus", "routes/about/calculus.tsx"),
  route("about/", "routes/about/index.tsx"),
  route("erlang-sandbox", "routes/erlang-sandbox/index.tsx"),
  route("pat-sandbox", "routes/pat-sandbox/index.tsx"),
  route("api/execute-erlang", "routes/api/execute-erlang.tsx"),
  route("api/check-pat", "routes/api/check-pat.tsx"),
  route("documentation", "routes/documentation/index.tsx"),
  route("communication-errors", "routes/communication-errors/index.tsx"),
] satisfies RouteConfig;
