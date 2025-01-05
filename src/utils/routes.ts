export function createRoute(
    routes: string[],
    params: { [key: string]: string | number } = {}
  ): string {
    let routePath = routes.join("/");
  
    Object.keys(params).forEach((key) => {
      const placeholder = `:${key}`;
      const value = `${params[key]}`;
      routePath = routePath.replace(new RegExp(placeholder, "g"), value);
    });
  
    const queryParams = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  
    if (queryParams) {
      routePath += `?${queryParams}`;
    }
  
    return routePath;
  }