import { createElement, createFragment } from "../"

function Wrapper({ id, children }: { id: string; children?: unknown }) {
  return <div id={id}>{children}</div>
}

describe("JSX mapping", () => {
  it("supports direct usage", () => {
    const element = createElement("div", { id: "test", className: "panel right" })
    expect(element.outerHTML).toEqual('<div id="test" class="panel right"></div>')
  })

  it("handles elements", () => {
    const element = <div id="test" className="panel right" />
    expect(element.outerHTML).toEqual('<div id="test" class="panel right"></div>')
  })

  it("handles function wrappers", () => {
    const element = (
      <Wrapper id="test">
        <span>Hello World</span>
      </Wrapper>
    )
    expect(element.outerHTML).toEqual('<div id="test"><span>Hello World</span></div>')
  })

  it("skips undefined children", () => {
    const element = <div id="test">{undefined}</div>
    expect(element.outerHTML).toEqual('<div id="test"></div>')
  })

  it("skips false children", () => {
    const element = <div id="test">{false}</div>
    expect(element.outerHTML).toEqual('<div id="test"></div>')
  })

  it("preserves zero children", () => {
    const element = <div id="test">{0}</div>
    expect(element.outerHTML).toEqual('<div id="test">0</div>')
  })

  it("registers event listeners", () => {
    let clicks = 0
    const element = <div id="test" onClick={() => clicks++} />
    expect(element.outerHTML).toEqual('<div id="test"></div>')

    element.click()
    expect(clicks).toEqual(1)
  })

  it("has correct event listener types", () => {
    const element = <div id="test" onClick={e => e.preventDefault()} />
    expect(element.outerHTML).toEqual('<div id="test"></div>')
  })

  it("binds styles correctly", () => {
    const element = <div id="test" style={{ color: "red", fontSize: "12px" }} />
    expect(element.outerHTML).toEqual('<div id="test" style="color: red; font-size: 12px;"></div>')
  })

  it("maps htmlFor to for attribute", () => {
    const element = <label htmlFor="test" />
    expect(element.outerHTML).toEqual('<label for="test"></label>')
  })

  it("creates fragments", () => {
    const fragment = (
      <>
        <span>Hello</span>
        <span>World</span>
      </>
    )
    const html = Array.from(fragment.children)
      .map(node => node.outerHTML)
      .join("")
    expect(html).toEqual("<span>Hello</span><span>World</span>")
  })

  it("creates fragment without children", () => {
    const fragment = <></>
    expect(fragment.children.length).toEqual(0)
  })

  it("flattens nested fragments", () => {
    const span = (
      <span>
        <>
          <span>Hello</span>
          <span>World</span>
        </>
        <>
          <span>!</span>
        </>
      </span>
    )
    expect(span.outerHTML).toEqual("<span><span>Hello</span><span>World</span><span>!</span></span>")
    expect(span.children.length).toEqual(3)
  })

  it("handles dangerouslySetInnerHTML", () => {
    const element = <div dangerouslySetInnerHTML={{ __html: "<span>Hello</span>" }} />
    expect(element.outerHTML).toEqual("<div><span>Hello</span></div>")

    // malicious payload
    const element2 = <div dangerouslySetInnerHTML={{ __html: "<script>alert('XSS')</script>" }} />
    expect(element2.outerHTML).toEqual("<div></div>")
  })
})

describe("createElement ref support", () => {
  it("calls ref function with the created element", () => {
    let refElement: HTMLElement | null = null
    const refFn = (el: HTMLElement) => {
      refElement = el
    }
    const el = createElement("div", { ref: refFn })
    expect(refElement).toBe(el)
    expect(el.tagName).toBe("DIV")
  })

  it("assigns element to ref object", () => {
    const refObj = { current: null as HTMLElement | null }
    const el = createElement("span", { ref: refObj })
    expect(refObj.current).toBe(el)
    expect(el.tagName).toBe("SPAN")
  })

  it("does not fail if ref is not provided", () => {
    const el = createElement("section", {})
    expect(el.tagName).toBe("SECTION")
  })
})
