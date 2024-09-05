

export const deepEquals = (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const flatA = Object.entries(flatten(a)).filter(p => p[1] !== undefined).sort().flatMap(([key, value]) => ( [key, value] ));
    const flatB = Object.entries(flatten(b)).filter(p => p[1] !== undefined).sort().flatMap(([key, value]) => ( [key, value] ));

    return flatA.toString() === flatB.toString();
}

const flatten = (obj: Record<string,unknown>, roots: string[] = [], sep = '.'): Record<string, unknown> => Object.keys(obj)
.reduce((memo, prop) =>
    Object.assign({},
    memo,
    Object.prototype.toString.call(obj[prop]) === '[object Object]'
      ? flatten(obj[prop] as Record<string, unknown>, roots.concat([prop]), sep) : {[roots.concat([prop]).join(sep)]: obj[prop]}
  ), {} as Record<string,unknown>)