// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
	interface Param {
		body?: string
		animation?: boolean
		autohide?: boolean
		btnClose?: boolean
		btnCloseWhite?: boolean
		className?: string
		delay?: number
		gap?: number
		header?: string
		margin?: string
		placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
	}
	declare const bs5: {
		Toast: {
			new(param: Param): {
				element: HTMLDivElement
				bootstrapToast: {
					show(): void
					hide(): void
				}

				show(): void
				hide(): void
			}
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	declare const bootstrap:  any
}

export { };
