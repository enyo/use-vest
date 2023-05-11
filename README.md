# use-vest

[![Tests](https://github.com/enyo/use-vest/actions/workflows/ci.yml/badge.svg)](https://github.com/enyo/use-vest/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/use-vest.svg)](https://badge.fury.io/js/use-vest)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)

> If you want to use Vest and Svelte, this library is for you!  
> But if you're using SvelteKit, I recommend to use [SuperForms](https://superforms.vercel.app).


This library provides a Svelte action for [Vest](https://vestjs.dev), that makes
it easy to validate forms and show errors when necessary — built with
TypeScript.

> **Vest**, in their own words is a "Declarative validations framework inspired
> by unit testing libraries". I recommend checking out [the vest
> documentation](https://vestjs.dev/docs/get_started#writing-your-first-suite)
> to learn how to write validations.

This svelte action is a **thin layer** for vest to integrate nicely with Svelte.
It aims to make it easy to use vest in your svelte forms to validate your data
and show errors. It will also wrap your call that submits the data to your
server and handle any errors that might happen there as well.

See it in action in this [Svelte
REPL](https://svelte.dev/repl/7094c5603d02477c8333ad42fc73c3d1?version=3.42.6)
or look at the example in [the example](./example/).

## Installation

```bash
npm install --save-prod use-vest
# or pnpmpnp
pnpm add use-vest
# or whatever package manager you like
```

## Core concept

In the component that contains your form, you invoke `useVest` which will create
a [Svelte context](https://svelte.dev/tutorial/context-api) that child input
fields can use to update values and display validation status.

The `useVest` call also returns a few objects, most notably:

- an `action` that should be used on your form like this: `<form use:action>`.
  This will take care of handling your submit event, and prevent submission if the
  validation fails.
- a `disabled` svelte store, that you can use to disable your form and fields
  (this takes into account whether your form is valid or submitting).
- an `error` store that might contain any error that happened during submission.

To learn about individual input field errors and validation, read the
[Usage](#usage) section.

## Usage

Let's assume you have finished [writing your
suite](https://vestjs.dev/docs/writing_your_suite/vests_suite) and have exported
the TypeScript type for your `FormData` (optional).

To see how you would incorporate `use-vest` in your form, look at the
[Form.svelte](./example/Form.svelte) file.

> **NOTE**: Instead of posting all code snippets directly in this README, I
> decided to use an `example/` directory and link to it. This way the example
> can be type checked, and is actually the source for the unit tests so there
> is no risk of the documentation being outdated.

As you can see, `useVest` returns a few stores that hold information about the
current state of your form.

**But how do the individual input fields get their validation status?**

`useVest` sets up a [Svelte context](https://svelte.dev/tutorial/context-api)
(that is accessible to all children) where everything necessary to display the
input field state is stored.

Any input field inside the form simply uses [`getVestContext()`](./src/context.ts) to get the
correct context object, and this object will contain the validation result, as
well as information about the form in general.

To see how you can use that context, look at
[Input.svelte](./example/Input.svelte) and
[InputError.svelte](./example/InputError.svelte).
