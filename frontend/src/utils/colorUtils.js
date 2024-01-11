const colors = {
    a: 'text-[#027BFC]',
    b: 'text-[#24D366]',
    c: 'text-[#E542A3]',
    d: 'text-[#A5B337]',
    e: 'text-[#FF2E74]',
    f: 'text-[#C4532D]',
    g: 'text-[#FA6633]',
    h: 'text-[#05A698]',
    i: 'text-[#04CF9C]',
    j: 'text-[#1DA855]',
    k: 'text-[#027BFC]',
    l: 'text-[#24D366]',
    m: 'text-[#A5B337]',
    n: 'text-[#A5B337]',
    o: 'text-[#FF2E74]',
    p: 'text-[#C4532D]',
    q: 'text-[#FA6633]',
    r: 'text-[#05A698]',
    s: 'text-[#04CF9C]',
    t: 'text-[#1DA855]',
    u: 'text-[#027BFC]',
    v: 'text-[#24D366]',
    w: 'text-[#E542A3]',
    x: 'text-[#A5B337]',
    y: 'text-[#FF2E74]',
    z: 'text-[#C4532D]',
}

export const getColor = (name) => {
    return colors[name.substring(0,1).toLowerCase()]
}