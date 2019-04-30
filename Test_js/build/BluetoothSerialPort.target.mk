# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := BluetoothSerialPort
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=BluetoothSerialPort' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG' \
	'-DV8_ENABLE_CHECKS'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-std=c++11 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Debug := \
	-I/home/evan/.node-gyp/8.10.0/include/node \
	-I/home/evan/.node-gyp/8.10.0/src \
	-I/home/evan/.node-gyp/8.10.0/deps/openssl/config \
	-I/home/evan/.node-gyp/8.10.0/deps/openssl/openssl/include \
	-I/home/evan/.node-gyp/8.10.0/deps/uv/include \
	-I/home/evan/.node-gyp/8.10.0/deps/zlib \
	-I/home/evan/.node-gyp/8.10.0/deps/v8/include \
	-I$(srcdir)/node_modules/nan \
	-I$(srcdir)/src

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=BluetoothSerialPort' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-std=c++11 \
	-O3 \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Release := \
	-I/home/evan/.node-gyp/8.10.0/include/node \
	-I/home/evan/.node-gyp/8.10.0/src \
	-I/home/evan/.node-gyp/8.10.0/deps/openssl/config \
	-I/home/evan/.node-gyp/8.10.0/deps/openssl/openssl/include \
	-I/home/evan/.node-gyp/8.10.0/deps/uv/include \
	-I/home/evan/.node-gyp/8.10.0/deps/zlib \
	-I/home/evan/.node-gyp/8.10.0/deps/v8/include \
	-I$(srcdir)/node_modules/nan \
	-I$(srcdir)/src

OBJS := \
	$(obj).target/$(TARGET)/src/linux/BluetoothSerialPort.o \
	$(obj).target/$(TARGET)/src/linux/DeviceINQ.o \
	$(obj).target/$(TARGET)/src/linux/BTSerialPortBinding.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS := \
	-lbluetooth

$(obj).target/BluetoothSerialPort.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/BluetoothSerialPort.node: LIBS := $(LIBS)
$(obj).target/BluetoothSerialPort.node: TOOLSET := $(TOOLSET)
$(obj).target/BluetoothSerialPort.node: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/BluetoothSerialPort.node
# Add target alias
.PHONY: BluetoothSerialPort
BluetoothSerialPort: $(builddir)/BluetoothSerialPort.node

# Copy this to the executable output path.
$(builddir)/BluetoothSerialPort.node: TOOLSET := $(TOOLSET)
$(builddir)/BluetoothSerialPort.node: $(obj).target/BluetoothSerialPort.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/BluetoothSerialPort.node
# Short alias for building this executable.
.PHONY: BluetoothSerialPort.node
BluetoothSerialPort.node: $(obj).target/BluetoothSerialPort.node $(builddir)/BluetoothSerialPort.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/BluetoothSerialPort.node
