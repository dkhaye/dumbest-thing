.PHONY: doctor verify final capture keynote clean

TAPES := $(shell find . -path "*/final/*/demo.tape" 2>/dev/null)

doctor:
	@bash scripts/check-tools.sh

verify:
	@bash scripts/run-all.sh all

final:
	@npm install --prefix typescript --silent
	@bash scripts/run-all.sh final

# Unconditional re-render — use when you want to force all videos to rebuild.
capture:
	@bash scripts/capture-final.sh

# Smart dependency chain for make keynote:
#   tapes → .last-capture → slides.pptx → slides.key
#
# .last-capture is a sentinel that records the last time capture ran.
# Make re-runs capture only when a tape is newer than the sentinel.

.last-capture: $(TAPES)
	@npm install --prefix typescript --silent
	@bash scripts/capture-final.sh
	@touch $@

slides.pptx: .last-capture scripts/build-slides.ts package.json
	@npm install --silent
	@npx tsx scripts/build-slides.ts "$(CURDIR)"

keynote: slides.pptx
	@open slides.pptx

# Remove all generated artifacts and force a full rebuild on next make keynote.
clean:
	@rm -f .last-capture slides.pptx
	@rm -rf videos/ captures/final/
	@find . -path "*/final/*/demo.mp4" -delete 2>/dev/null || true
	@echo "cleaned"
