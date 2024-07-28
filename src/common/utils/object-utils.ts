

export const deepEquals = (a: Object, b: Object) => {
    const flatA = Object.entries(a).filter( p => !!p[1]).sort().flatMap(([key, value]) => ( [key, value] ));
    const flatB = Object.entries(b).filter( p => !!p[1]).sort().flatMap(([key, value]) => ( [key, value] ));

    console.info( 'flatA', flatA );
    console.info( 'flatB', flatB );
    console.info( flatA.toString() === flatB.toString() )

    return flatA.toString() === flatB.toString();
}