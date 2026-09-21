.PHONY: doctor verify final capture

doctor:
	@bash scripts/check-tools.sh

verify:
	@bash scripts/run-all.sh all

final:
	@bash scripts/run-all.sh final

capture:
	@bash scripts/capture-final.sh
