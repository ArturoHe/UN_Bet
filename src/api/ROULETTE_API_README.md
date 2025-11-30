# API de Ruleta - Documentación

## Descripción General

Esta implementación conecta el frontend de la ruleta con el backend usando las siguientes rutas:

## Endpoints Implementados

### 1. Crear Sesión

```
POST /v1/roulette/session
```

**Respuesta:**

```json
{
  "session_id": 1,
  "server_seed_hash": "d8ec1492493801c6f1cc3cb095db4c42fdf2d676291a74a109a4446d22ccebf5"
}
```

### 2. Obtener Hash de Sesión

```
GET /v1/roulette/session/{session_id}/hash
```

**Respuesta:**

```json
{
  "session_id": 1,
  "server_seed_hash": "d8ec1492493801c6f1cc3cb095db4c42fdf2d676291a74a109a4446d22ccebf5"
}
```

### 3. Girar la Ruleta

```
POST /v1/roulette/session/{session_id}/spin
```

**Request:**

```json
{
  "client_seed": "miSemilla123"
}
```

**Respuesta:**

```json
{
  "session_id": 1,
  "nonce": 0,
  "pocket": 6,
  "color": "black",
  "hmac_hex": "078cf37a722ae9bb502b78d075ddc9b69d8d7d2aed6bbf00e99b37a80b645aa2",
  "server_seed_hash": "d8ec1492493801c6f1cc3cb095db4c42fdf2d676291a74a109a4446d22ccebf5"
}
```

### 4. Realizar Apuesta

```
POST /v1/roulette/session/{session_id}/bet
```

**Request:**

```json
{
  "client_seed": "miSemilla123",
  "bet": {
    "type": "red",
    "amount": 10.0
  }
}
```

## Tipos de Apuesta Soportados

El método `getBetTypeFromItem()` convierte los tipos del frontend al formato del backend:

- **Números individuales**: `number_0`, `number_1`, ..., `number_36`
- **Colores**: `red`, `black`
- **Paridad**: `even`, `odd`
- **Rangos**: `1-18`, `19-36`
- **Docenas**: `1st_12`, `2nd_12`, `3rd_12`

## Flujo de Uso

1. **Al montar el componente**: Se crea automáticamente una sesión (`initializeSession()`)
2. **Colocar fichas**: El usuario selecciona una ficha y hace clic en el tablero
3. **Realizar apuesta**: Al hacer clic en "Place Bet & Spin":
   - Se envían todas las apuestas al backend
   - Automáticamente se gira la ruleta (`handleSpin()`)
   - Se muestra el resultado y se actualiza el historial
4. **Nueva ronda**: Después de 5 segundos, vuelve al estado de apuestas

## Estado del Componente

Nuevos campos agregados al `RouletteWrapperState`:

```typescript
{
  sessionId: number | null; // ID de la sesión activa
  serverSeedHash: string | null; // Hash del servidor
  clientSeed: string; // Semilla del cliente (auto-generada)
  isSpinning: boolean; // Estado de giro
}
```

## Funciones Principales

### `initializeSession()`

Crea una nueva sesión de ruleta al iniciar el componente.

### `handleSpin()`

Realiza el giro de la ruleta y actualiza el estado con el resultado.

### `placeBet()`

Envía todas las apuestas colocadas al backend y luego ejecuta el giro.

### `generateClientSeed()`

Genera una semilla de cliente aleatoria para cada giro.

### `getBetTypeFromItem(item: Item)`

Convierte el tipo de apuesta del frontend al formato esperado por el backend.

## Notas Importantes

- La semilla del cliente se regenera automáticamente después de cada giro
- Las apuestas solo se pueden realizar en el estado `GameStages.PLACE_BET`
- El componente muestra información de la sesión y la semilla actual en la UI
- El historial muestra los últimos 10 resultados

## Configuración del Backend

Asegúrate de que tu backend esté corriendo en `http://127.0.0.1:8000` o actualiza la URL en `src/api/axiosConfig.ts`.
