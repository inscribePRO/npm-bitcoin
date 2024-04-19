import { p2wpkh } from '../src/index';

describe('estimate vsize', () => {
  it('p2wpkh: 1', () => {
    const vsize = p2wpkh(
      [
        { address: 'bc1qvudq72lumyweraq639nkv7r2pr3np6mtrft02t', value: 10000 },
      ]
    );

    expect(vsize).toBe(141);
  });

  it('p2wpkh: 2', () => {
    const vsize = p2wpkh(
      [
        { address: 'bc1qvudq72lumyweraq639nkv7r2pr3np6mtrft02t', value: 10000 },
        { address: 'bc1quvl3t9nv6w3skjmv2fvslyh4gct5ku8r5g0ras', value: 10000 },
      ]
    );

    expect(vsize).toBe(172);
  });

  it('p2tr: 1', () => {
    const vsize = p2wpkh(
      [
        { address: 'bc1p7aexl7v5vp839tj3z73wwps5r3ewqwq8ttqxngs090jnwlzqg6nq67geuw', value: 10000 },
      ]
    );

    expect(vsize).toBe(153);
  });

  it('p2tr: 3', () => {
    const vsize = p2wpkh(
      [
        { address: 'bc1p7aexl7v5vp839tj3z73wwps5r3ewqwq8ttqxngs090jnwlzqg6nq67geuw', value: 10000 },
        { address: 'bc1pmnrvy87m4cjau0p0tm6qy3sfeyptfmf7d89zerq2xelfxeddk4ss2hew8f', value: 10000 },
        { address: 'bc1pkwzqdk76vtqrpm7l9rlsw0glg89fv8qulkcqlz3wskquzgvgd7wqxsl59u', value: 10000 },
      ]
    );

    expect(vsize).toBe(239);
  });

  it('p2sh: 1', () => {
    const vsize = p2wpkh(
      [
        { address: '3CoMxBzdqsRB7Vj6uPkfUQxL6HhFCDx2oQ', value: 10000 },
      ]
    );

    expect(vsize).toBe(142);
  });

  it('p2sh: 4', () => {
    const vsize = p2wpkh(
      [
        { address: '3CoMxBzdqsRB7Vj6uPkfUQxL6HhFCDx2oQ', value: 10000 },
        { address: '39nez93AVBK8dfnbCKmjqm8ir3TauMMD9S', value: 10000 },
        { address: '325APEeq2HUJLcPuynjAfBQ1gZmNwgWhM2', value: 10000 },
        { address: '38RyKr68zmzZS6Tnquvn32rjZg6HKYbxp8', value: 10000 },
      ]
    );

    expect(vsize).toBe(238);
  });

  it('p2pkh: 1', () => {
    const vsize = p2wpkh(
      [
        { address: '1AQ9pPWFJWfCZ4MaErgz8uKhLWAFuBfZyP', value: 10000 },
      ]
    );

    expect(vsize).toBe(144);
  });

  it('p2pkh: 5', () => {
    const vsize = p2wpkh(
      [
        { address: '1AQ9pPWFJWfCZ4MaErgz8uKhLWAFuBfZyP', value: 10000 },
        { address: '1MiZxiqeKGo498FjdfXuUMHhmqBSFrx7bD', value: 10000 },
        { address: '171YNyy6qLyYThaMhrq6XSsn5FHQD7Ez8c', value: 10000 },
        { address: '1HD2CszsNx9aWAV1mZXXm68d5hCTATaguF', value: 10000 },
        { address: '1KZAmVCpamk3ajFL9GMhxpyPqqZYGXCD5f', value: 10000 },
      ]
    );

    expect(vsize).toBe(280);
  });
});