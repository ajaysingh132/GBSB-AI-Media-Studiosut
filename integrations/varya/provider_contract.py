"""Provider contract placeholder for the Varya integration.

No Varya endpoints or payload schemas are assumed here. Implement the
adapter only after official API access and documentation are received.
"""
from __future__ import annotations

from typing import Any, Protocol


class VaryaNotConfiguredError(RuntimeError):
    """Raised while official API access/configuration is unavailable."""


class VaryaProvider(Protocol):
    async def generate_text_to_video(self, request: dict[str, Any]) -> dict[str, Any]:
        """Generate a video using the officially documented Varya API."""
        ...

    async def generate_image_to_video(self, request: dict[str, Any]) -> dict[str, Any]:
        """Generate a video from an image using the officially documented API."""
        ...

    async def get_generation_status(self, generation_id: str) -> dict[str, Any]:
        """Fetch status using the officially documented Varya API."""
        ...

    async def get_video_asset(self, generation_id: str) -> dict[str, Any]:
        """Retrieve the generated asset using the officially documented API."""
        ...


class UnconfiguredVaryaProvider:
    """Safe default: fails closed until approved API details are configured."""

    async def generate_text_to_video(self, request: dict[str, Any]) -> dict[str, Any]:
        raise VaryaNotConfiguredError(
            "Varya integration is disabled pending API approval and official documentation."
        )

    async def generate_image_to_video(self, request: dict[str, Any]) -> dict[str, Any]:
        raise VaryaNotConfiguredError(
            "Varya integration is disabled pending API approval and official documentation."
        )

    async def get_generation_status(self, generation_id: str) -> dict[str, Any]:
        raise VaryaNotConfiguredError(
            "Varya integration is disabled pending API approval and official documentation."
        )

    async def get_video_asset(self, generation_id: str) -> dict[str, Any]:
        raise VaryaNotConfiguredError(
            "Varya integration is disabled pending API approval and official documentation."
        )
