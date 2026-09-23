-- Opens slides.pptx in Keynote, saves as slides.key, closes.
on run argv
  set repoRoot to item 1 of argv
  set pptxFile to repoRoot & "/slides.pptx"
  set keyFile to repoRoot & "/slides.key"

  with timeout of 120 seconds
    tell application "Keynote"
      open POSIX file pptxFile

      -- Poll until the document is ready (PPTX import takes variable time)
      set waited to 0
      repeat while (count of documents) is 0
        delay 1
        set waited to waited + 1
        if waited > 60 then error "Timed out waiting for Keynote to open " & pptxFile
      end repeat

      save document 1 in POSIX file keyFile
      close document 1 saving no
    end tell
  end timeout

  return "saved → " & keyFile
end run
