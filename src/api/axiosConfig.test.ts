import api from './axiosConfig';

describe('Axios Config', () => {
  it('creates axios instance with correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://127.0.0.1:8000');
  });

  it('sets correct timeout', () => {
    expect(api.defaults.timeout).toBe(5000);
  });

  it('sets correct content type header', () => {
    expect(api.defaults.headers.common['Content-Type']).toBe('application/json');
  });

  it('is an axios instance', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.delete).toBeDefined();
  });
});
