import Handlebars from "handlebars"
import { TagExtended } from "../../types"

export const loadTagFallbackUsernameHelper = (hbs: typeof Handlebars) => {
  hbs.registerHelper("tagFallbackUsername", function (options) {
    const { fallback, tags_extended, user, terms } = options?.hash || {}

    const contentTags = tags_extended?.filter(
      (tag: TagExtended) => tag.type === "content" && tag.publicly_visible && tag.tag.includes("@")
    )

    const displayedItem = user && user.length ? user : terms && terms.length ? terms[0] : ""

    const content = contentTags?.length ? contentTags[0].tag : `@${displayedItem.length ? displayedItem : fallback}`

    return new hbs.SafeString(`<div class="user-handle">${content}</div>`)
  })
}
