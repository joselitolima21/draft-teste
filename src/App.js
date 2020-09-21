import React, { useState } from 'react';
import './App.css'
import DOMPurify from 'dompurify'
import { convertFromRaw } from "draft-js"
import { convertToHTML } from "draft-convert"
import { DraftailEditor, ENTITY_TYPE,BLOCK_TYPE, INLINE_STYLE } from "draftail"

export default function App() {
  const [contentH,setContentH] = useState('')

  const exporterConfig = {
    blockToHTML: (block) => {
      if (block.type === BLOCK_TYPE.BLOCKQUOTE) {
        return <blockquote />
      }

      // Discard atomic blocks, as they get converted based on their entity.
      if (block.type === BLOCK_TYPE.ATOMIC) {
        return {
          start: "",
          end: "",
        }
      }

      return null
    },

    entityToHTML: (entity, originalText) => {
      if (entity.type === ENTITY_TYPE.LINK) {
        return <a href={entity.data.url}>{originalText}</a>
      }

      if (entity.type === ENTITY_TYPE.IMAGE) {
        return <img src={entity.data.src} alt={entity.data.alt} />
      }

      if (entity.type === ENTITY_TYPE.HORIZONTAL_RULE) {
        return <hr />
      }

      return originalText
    },
  }

  const toHTML = (raw) =>
    raw ? convertToHTML(exporterConfig)(convertFromRaw(raw)) : ""

  return (
    <>
      <div className="editor">
        <DraftailEditor
          onSave={(raw) => {
            console.log(toHTML(raw))
            setContentH(toHTML(raw))
          }}
          blockTypes={[
            { type: BLOCK_TYPE.HEADER_THREE },
            { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
          ]}
          inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
        />
      </div>
      <div className="show" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(contentH)}}>
      </div>
    </>
  );
}


