// Local fallback for when Supabase is not fully configured (e.g. running the
// app locally without SUPABASE_SERVICE_ROLE_KEY, with app auth disabled).
//
// Returns a Proxy that mimics a Supabase query builder: every method call is
// chainable and the object is awaitable, always resolving to an empty result
// ({ data: [], error: null, count: 0 }). This lets server functions run and
// return empty datasets instead of throwing / hanging.

const EMPTY_RESULT = { data: [] as unknown[], error: null, count: 0 };

export function makeEmptySupabaseStub(): any {
  const proxy: any = new Proxy(function () {}, {
    get(_target, prop) {
      // Make the proxy awaitable (thenable).
      if (prop === "then") {
        return (onFulfilled: (v: typeof EMPTY_RESULT) => unknown) =>
          Promise.resolve(EMPTY_RESULT).then(onFulfilled);
      }
      // Any other property (from, select, eq, order, insert, ...) is a
      // chainable method returning the same proxy.
      return () => proxy;
    },
    apply() {
      return proxy;
    },
  });
  return proxy;
}
