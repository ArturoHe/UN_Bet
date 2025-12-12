# Integración del Backend de Slot Machine

## Descripción General

Esta integración conecta el frontend de la máquina tragamonedas con el backend, proporcionando un sistema de juego justo y verificable (provably fair).

## Flujo de Funcionamiento

### 1. Inicialización de la Sesión

Cuando el usuario entra al juego:

- Se crea una nueva sesión con `slotMachineApi.createSession()`
- El backend genera un `server_seed` y devuelve su hash
- El frontend genera un `client_seed` aleatorio
- Se obtiene el saldo actual del usuario

### 2. Proceso de Giro (Spin)

Cuando el usuario presiona "Girar":

1. Se valida que haya saldo suficiente
2. Se envía la solicitud al backend con:

   - `session_id`: ID de la sesión actual
   - `client_seed`: Semilla del cliente
   - `bet_amount`: Monto de la apuesta

3. El backend:

   - Valida el saldo
   - Genera el resultado usando `server_seed` + `client_seed` + `nonce`
   - Calcula las ganancias
   - Actualiza el saldo del usuario
   - Devuelve el resultado

4. El frontend:
   - Recibe el resultado `[índice0, índice1, índice2]`
   - Anima los carretes hacia ese resultado
   - Actualiza el saldo mostrado
   - Genera un nuevo `client_seed` para la próxima jugada

### 3. Actualización del Saldo

El saldo se actualiza en tiempo real:

- Se descuenta la apuesta antes de girar
- Se suma la ganancia después de recibir el resultado del backend

## API Endpoints

### Crear Sesión

```typescript
POST /v1/slots/session
Response: { session_id: number, server_seed_hash: string }
```

### Girar

```typescript
POST /v1/slots/session/:sessionId/spin
Body: { client_seed: string, bet_amount: number }
Response: {
  session_id: number,
  nonce: number,
  result: number[],
  symbols: string[],
  win_amount: number,
  multiplier: number,
  hmac_hex: string,
  server_seed_hash: string
}
```

### Obtener Saldo

```typescript
GET / profile / me / saldo;
Headers: {
  Authorization: "Bearer <token>";
}
Response: {
  saldo: number;
}
```

## Símbolos y Multiplicadores

Los símbolos se definen en el frontend y backend:

- 🍒 (Cherry): x2
- 🍋 (Lemon): x3
- 🍊 (Orange): x5
- 🍇 (Grape): x8
- ⭐ (Star): x15
- 💎 (Diamond): x25
- 7️⃣ (Seven): x50

## Manejo de Errores

El sistema maneja varios tipos de errores:

- **Saldo insuficiente**: Muestra alerta antes de enviar al backend
- **Error 400**: Problema con la apuesta (muestra detalle del backend)
- **Error 401**: Sesión expirada (pide volver a iniciar sesión)
- **Error de red**: Restaura el estado y muestra mensaje genérico

## Provably Fair

El sistema implementa un mecanismo provably fair:

- El `server_seed_hash` se comparte antes del giro
- Después del giro, se proporciona el `hmac_hex` para verificación
- El jugador puede verificar que el resultado fue generado correctamente

## Notas Importantes

1. El `client_seed` se regenera después de cada giro para aumentar la aleatoriedad
2. El saldo se actualiza localmente pero siempre se valida en el backend
3. Los resultados vienen como índices del array de símbolos (0-6)
4. El componente SlotMachine maneja la animación de los carretes
